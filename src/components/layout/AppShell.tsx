'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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
//
// open 用 ref 命令式赋值，不走 JSX 布尔属性（见 AboutDialog 的注释）。
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
          <div className="app-content">{children}</div>
          <SiteFooter />
        </mdui-layout-main>
      </mdui-layout>

      <AboutDialog ref={aboutRef} />
    </>
  );
}
