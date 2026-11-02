'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useDrawerSwipe } from '@/hooks/useDrawerSwipe';
import AboutDialog from './AboutDialog';
import SideNav from './SideNav';
import SiteFooter from './SiteFooter';
import TopBar from './TopBar';

// ============================================================
// 应用外壳
// ------------------------------------------------------------
// <mdui-layout> 是必须的：导航抽屉裸用是 position: fixed 且从 y=0 铺满，
// 会把顶栏最左的开关按钮盖住（开抽屉的入口被自己挡住）；放进 layout 后
// 它自动变 absolute，只占顶栏以下的区域。
//
// 抽屉不传 modal：MDUI 的规则是「屏宽 < 840px 时无视 modal 强制遮罩」，
// 正好实现「桌面推挤内容 / 窄屏覆盖 + 遮罩」。
// 窄屏时抽屉要让开顶栏，靠的是 _sidebar.scss 里的 top 覆盖（MDUI 内部
// 对 [mobile] 用了 !important，只能从外层同权重压回去）。
//
// open 用 ref 命令式赋值，不走 JSX 布尔属性（见 AboutDialog 的注释）。
// 滑动手势（窄屏边缘右滑打开 / 抽屉内左滑关闭）见 useDrawerSwipe。
// ============================================================

/** 与 --mdui-breakpoint-md 对齐：>= 840px 视为桌面 */
const DESKTOP_QUERY = '(min-width: 840px)';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useDrawerSwipe(drawerRef);

  // 把顶栏真实高度写进 --app-bar-h：抽屉让位、主区留白都读它。
  // 顶栏是 MDUI 组件，首次渲染时还没注册（高度为 0），
  // 所以用 ResizeObserver 等它成型后再补一次，不写死 64。
  useEffect(() => {
    const bar = document.querySelector('mdui-top-app-bar');
    if (!bar) return;

    const sync = () => {
      const height = bar.getBoundingClientRect().height;
      if (height > 0) {
        document.documentElement.style.setProperty('--app-bar-h', `${height}px`);
      }
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    const media = window.matchMedia(DESKTOP_QUERY);
    const el = drawer as HTMLElement & { open: boolean };

    // 首屏按断点决定初始状态；断点翻转时同步（旋转屏幕 / 拖窗口）
    const syncWithViewport = () => {
      el.open = media.matches;
    };

    const onOpened = () => setDrawerOpen(true);
    const onClosed = () => setDrawerOpen(false);

    syncWithViewport();
    media.addEventListener('change', syncWithViewport);
    drawer.addEventListener('opened', onOpened);
    drawer.addEventListener('closed', onClosed);

    return () => {
      media.removeEventListener('change', syncWithViewport);
      drawer.removeEventListener('opened', onOpened);
      drawer.removeEventListener('closed', onClosed);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    const el = drawerRef.current as (HTMLElement & { open: boolean }) | null;
    if (el) el.open = !el.open;
  }, []);

  const openAbout = useCallback(() => {
    const el = aboutRef.current as (HTMLElement & { open: boolean }) | null;
    if (el) el.open = true;
  }, []);

  /** 点侧栏条目后：窄屏（覆盖式）要收起，桌面（推挤式）保持展开 */
  const closeOnNarrow = useCallback(() => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      const el = drawerRef.current as (HTMLElement & { open: boolean }) | null;
      if (el) el.open = false;
    }
  }, []);

  return (
    <>
      <mdui-layout full-height className="app-layout">
        <TopBar drawerOpen={drawerOpen} onToggleMenu={toggleMenu} onAbout={openAbout} />

        <mdui-navigation-drawer ref={drawerRef} id="site-nav" close-on-esc close-on-overlay-click>
          <SideNav onNavigate={closeOnNarrow} />
        </mdui-navigation-drawer>

        <mdui-layout-main className="app-main">
          {/* 滚动容器下移一层：mdui-layout-main 自己有 padding-top（顶栏高度），
              如果把 overflow 放在它身上，滚动条会从视口顶端 y=0 开始，
              顶上那 64px 正好被 position: absolute 的顶栏盖住。
              放在内层 .app-scroll 里，滚动条自然从顶栏下边缘起。 */}
          <div className="app-scroll">
            <div className="app-content">{children}</div>
            <SiteFooter />
          </div>
        </mdui-layout-main>
      </mdui-layout>

      <AboutDialog ref={aboutRef} />
    </>
  );
}
