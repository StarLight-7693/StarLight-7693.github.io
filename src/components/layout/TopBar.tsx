'use client';

import { ICONS } from '@/data/icons';
import { SITE } from '@/data/site';
import ThemeToggle from './ThemeToggle';

// ============================================================
// 顶栏
// ------------------------------------------------------------
// 左：侧栏开关 + 站名；右：深色开关 + 竖三点弹出菜单（只有「关于」）。
// 结构遵循 MDUI 官方示例：控件之间放一个 flex-grow 撑开，
// 否则标题与右侧按钮会挤在一起。
//
// 「关于」对话框不放在这里：顶栏是 flex 容器，塞进去的浮层会被卷进
// 它的布局；对话框统一由 AppShell 挂在 layout 之外。
// ============================================================

interface TopBarProps {
  drawerOpen: boolean;
  onToggleMenu: () => void;
  onAbout: () => void;
}

export default function TopBar({ drawerOpen, onToggleMenu, onAbout }: TopBarProps) {
  return (
    // scroll-target 必须显式指向主区：页面滚动已经从 window 移交给
    // <mdui-layout-main>（侧栏与顶栏才能保持不动），顶栏默认监听 window
    // 会永远收不到 scroll 事件，elevate 阴影就再也不会出现
    <mdui-top-app-bar
      scroll-behavior="elevate"
      scroll-target="mdui-layout-main"
      className="app-bar"
      id="site-bar"
    >
      <mdui-button-icon
        icon={drawerOpen ? ICONS.close : ICONS.menu}
        aria-label={drawerOpen ? '收起导航' : '展开导航'}
        aria-expanded={drawerOpen}
        aria-controls="site-nav"
        onClick={onToggleMenu}
      />

      <mdui-top-app-bar-title>{SITE.name}</mdui-top-app-bar-title>

      <div className="app-bar-spacer" />

      <ThemeToggle />

      <mdui-dropdown>
        <mdui-button-icon slot="trigger" icon={ICONS.moreVert} aria-label="更多菜单" />
        <mdui-menu>
          <mdui-menu-item icon={ICONS.info} onClick={onAbout}>
            关于
          </mdui-menu-item>
        </mdui-menu>
      </mdui-dropdown>
    </mdui-top-app-bar>
  );
}
