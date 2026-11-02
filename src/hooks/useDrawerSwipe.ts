'use client';

import { useEffect, type RefObject } from 'react';

// ============================================================
// 抽屉的滑动手势（仅窄屏）
// ------------------------------------------------------------
// 两条手势，都跟手：
//   1. 屏幕左边缘右滑 → 面板跟着手指滑出
//   2. 抽屉内左滑     → 面板跟着手指缩回去
//
// 为什么起手区不从 x=0 开始：
//   全面屏的「返回」手势贴在屏幕最外侧，起手点太靠边会被系统吞掉，
//   页面根本收不到 pointer 事件。所以留出 EDGE_START 的缓冲，
//   判定区是 [EDGE_START, EDGE_END]，宽约 100px —— 比系统手势区大得多，
//   用户不必精确对准边缘。
//
// 跟手为什么要跟 WAAPI 抢控制权：
//   MDUI 的开关不是 CSS transition，而是对 panel 调 element.animate()
//   做 translateX(-100%) → 0。WAAPI 动画的优先级高于内联样式，
//   所以拖拽开始必须先 getAnimations().cancel()，之后内联 transform 才生效。
//   松手时同理：往「关」的方向收尾时，先用 visibility 把 MDUI 自己的关闭动画
//   挡住，否则会看到面板先弹回 0 再滑出去的鬼影。
//
// 方向锁：位移超过 LOCK 后先判方向，竖向占优就放弃，
// 把这一串手势还给列表滚动。
// ============================================================

/** 与 AppShell 的断点保持一致：>= 840px 抽屉常驻，不启用手势 */
const NARROW_QUERY = '(max-width: 839.98px)';

/** 最外侧留给系统返回手势，不参与判定 */
const EDGE_START = 12;
/** 边缘起手区的右边界 */
const EDGE_END = 120;
/** 方向锁定前需要的最小位移 */
const LOCK_DISTANCE = 10;
/** 水平位移必须是垂直位移的多少倍，才算横滑 */
const ANGLE_RATIO = 1.2;
/** 松手时判定为「继续」的位移比例（占面板宽度） */
const DISTANCE_RATIO = 0.35;
/** 快速轻扫也要有这点位移打底，否则指尖一抖就把抽屉甩走 */
const FLING_MIN_RATIO = 0.15;
/** 快速轻扫的判定速度（px/ms） */
const FLING_VELOCITY = 0.5;
/** 松手后的收尾动画时长 */
const SETTLE_MS = 200;

type Phase = 'open' | 'close';

interface Drag {
  phase: Phase;
  startX: number;
  startY: number;
  startTime: number;
  width: number;
  active: boolean;
  lastX: number;
  /** 当前应该应用的位移，供接管循环反复写回 */
  offset: number;
}

/** 抽屉里的面板（在 shadow root 里） */
function getPanel(drawer: HTMLElement): HTMLElement | null {
  return drawer.shadowRoot?.querySelector<HTMLElement>('[part="panel"]') ?? null;
}

/**
 * 面板宽度。
 *
 * 抽屉关着的时候宿主是 display:none，量出来是 0 —— 而「边缘右滑打开」
 * 恰好就是在关着的时候起手，所以量不到时退回 CSS 里的 --drawer-w，
 * 并按窄屏的 max-width: calc(100% - 56px) 收一次上限。
 */
function panelWidth(panel: HTMLElement | null): number {
  const measured = panel?.getBoundingClientRect().width ?? 0;
  if (measured > 0) return measured;

  const root = getComputedStyle(document.documentElement).getPropertyValue('--drawer-w');
  const declared = Number.parseFloat(root) || 272;
  return Math.min(declared, Math.max(0, window.innerWidth - 56));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * 给抽屉挂上跟手的滑动手势。
 *
 * @param ref 抽屉元素（`mdui-navigation-drawer`）
 */
export function useDrawerSwipe(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const drawer = ref.current as (HTMLElement & { open: boolean }) | null;
    if (!drawer) return;

    const narrow = window.matchMedia(NARROW_QUERY);
    let drag: Drag | null = null;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    /** 清掉拖拽留下的内联样式，把控制权还给 MDUI */
    const releasePanel = (panel: HTMLElement | null) => {
      if (!panel) return;
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.visibility = '';
    };

    const stopAnimations = (panel: HTMLElement | null) => {
      if (!panel) return;
      for (const animation of panel.getAnimations()) animation.cancel();
    };

    /** 收尾：从当前位置滑到目标，再交还控制权 */
    const settle = (toOpen: boolean) => {
      const panel = getPanel(drawer);
      if (!panel) {
        drawer.open = toOpen;
        return;
      }

      if (settleTimer) clearTimeout(settleTimer);
      panel.style.visibility = '';
      panel.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.2, 0, 0, 1)`;
      panel.style.transform = toOpen ? 'translateX(0)' : 'translateX(-100%)';

      settleTimer = setTimeout(() => {
        settleTimer = null;
        if (toOpen) {
          // 已经到 0，清掉内联即可，MDUI 的 open 状态就是它
          releasePanel(panel);
          return;
        }
        // 往「关」：先遮住 MDUI 自己的关闭动画（否则会弹回 0 再滑出），
        // 等它播完（closed 事件）再恢复可见
        panel.style.visibility = 'hidden';
        drawer.open = false;
      }, SETTLE_MS);
    };

    const onPointerDown = (event: PointerEvent) => {
      // 鼠标（含触控笔电的触控板）不做手势：宽屏抽屉本来就常驻
      if (event.pointerType === 'mouse') return;
      if (!event.isPrimary) return;
      if (!narrow.matches) return;
      if (settleTimer) return; // 上一段收尾还没走完，别再叠一层

      const panel = getPanel(drawer);
      const width = panelWidth(panel);

      if (drawer.open) {
        // 关闭手势：起点必须在面板横向范围内（纵向不限，列表任意位置都能左滑）
        const box = drawer.getBoundingClientRect();
        if (event.clientX > box.left + width) return;
        drag = {
          phase: 'close',
          startX: event.clientX,
          startY: event.clientY,
          startTime: performance.now(),
          width,
          active: false,
          lastX: event.clientX,
          offset: -width,
        };
        return;
      }

      // 打开手势：起点必须落在「稍微离边」的那段带子里
      if (event.clientX < EDGE_START || event.clientX > EDGE_END) return;
      drag = {
        phase: 'open',
        startX: event.clientX,
        startY: event.clientY,
        startTime: performance.now(),
        width,
        active: false,
        lastX: event.clientX,
        offset: -width,
      };
    };

    /**
     * 拖拽期间持续压住 MDUI 的动画。
     *
     * MDUI 的开关动画是它自己在 updated 生命周期里、等组件定义完成后
     * 才排帧启动的 WAAPI 动画 —— 我们第一帧 cancel 掉的那次可能还没生出来。
     * 所以只要手指还在拖，就每帧 cancel 一次并把位移写回去；
     * 动画只创建一次，通常两三个 rAF 之后就彻底安静了。
     */
    const holdPanel = () => {
      if (!drag) return;
      const panel = getPanel(drawer);
      if (panel) {
        stopAnimations(panel);
        panel.style.transition = 'none';
        panel.style.transform = `translateX(${drag.offset}px)`;
      }
      requestAnimationFrame(holdPanel);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      if (!drag.active) {
        if (Math.abs(dx) < LOCK_DISTANCE && Math.abs(dy) < LOCK_DISTANCE) return;
        // 竖向为主：不是横滑，交还给页面滚动
        if (Math.abs(dy) > Math.abs(dx) * ANGLE_RATIO) {
          drag = null;
          return;
        }
        // 方向不对（开抽屉要往右、关抽屉要往左）
        if (drag.phase === 'open' ? dx <= 0 : dx >= 0) {
          drag = null;
          return;
        }

        drag.active = true;
        if (drag.phase === 'open') {
          // 让面板先出现（host 默认 display:none），然后开始接管
          drawer.open = true;
        }
        // 两种方向都启动接管循环：立即生效，并在后续帧里持续压住 MDUI 的动画
        requestAnimationFrame(holdPanel);
      }

      const panel = getPanel(drawer);
      if (!panel) return;

      const offset =
        drag.phase === 'open' ? clamp(-drag.width + dx, -drag.width, 0) : clamp(dx, -drag.width, 0);

      drag.offset = offset;
      panel.style.transform = `translateX(${offset}px)`;
      drag.lastX = event.clientX;
    };

    const onPointerUp = () => {
      if (!drag) return;
      const current = drag;
      drag = null;

      if (!current.active) return;

      // 平均速度：短距离快速甩动也算数（拖了很久才松手则速度自然低，不误判）
      const duration = performance.now() - current.startTime;
      const travelled = current.lastX - current.startX;
      const velocity = duration > 0 ? travelled / duration : 0;

      const passed = Math.abs(travelled) > current.width * DISTANCE_RATIO;
      const flung =
        Math.abs(travelled) > current.width * FLING_MIN_RATIO &&
        Math.abs(velocity) > FLING_VELOCITY;

      if (current.phase === 'open') {
        settle(travelled > 0 && (passed || flung));
      } else {
        settle(!(travelled < 0 && (passed || flung)));
      }
    };

    const onCancel = () => {
      if (!drag) return;
      const current = drag;
      drag = null;
      if (current.active) settle(current.phase !== 'open');
    };

    /** 关闭动画结束：把被我们藏起来的面板恢复原样 */
    const onClosed = () => {
      releasePanel(getPanel(drawer));
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointercancel', onCancel, { passive: true });
    drawer.addEventListener('closed', onClosed);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onCancel);
      drawer.removeEventListener('closed', onClosed);
      if (settleTimer) clearTimeout(settleTimer);
      releasePanel(getPanel(drawer));
    };
  }, [ref]);
}
