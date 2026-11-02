'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { ICONS } from '@/data/icons';
import { toolPath } from '@/data/site';
import { getGroupedTools } from '@/data/tools';
import type { MduiRippleElement } from '@/types/mdui';

// ============================================================
// 侧栏导航
// ------------------------------------------------------------
// 结构：首页 + 「工具」分组（组内按 category 再分组）。
//
// 为什么用 <Link> 而不是 mdui-list-item 的 href：
//   list-item 一旦设 href 就会自己渲染 <a>，点击是整页刷新，
//   会丢掉 Next 的客户端路由与滚动恢复。这里用 Link + 自绘行，
//   视觉（圆角、悬停底色、选中容器色）全部取自 MDUI 令牌。
//
// 按压手感：
//   <mdui-ripple> 是 MDUI 的涟漪层，:host 自带 absolute + pointer-events:none，
//   也就是说它不自己绑事件，必须由外层在 pointerdown 时喂坐标、抬起时收尾。
//   这里在每个 <a> 上绑四个指针事件驱动它；按压缩放交给 CSS 的 :active。
// ============================================================

/** 去掉尾斜杠再比较，兼容 trailingSlash 的两种返回形态 */
function normalize(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}

function NavItem({ href, icon, label, active, onNavigate }: NavItemProps) {
  const rippleRef = useRef<MduiRippleElement | null>(null);

  return (
    <Link
      className={active ? 'nav-item is-active' : 'nav-item'}
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onNavigate}
      onPointerDown={(event) => rippleRef.current?.startPress(event.nativeEvent)}
      onPointerUp={() => rippleRef.current?.endPress()}
      onPointerLeave={() => rippleRef.current?.endPress()}
      onPointerCancel={() => rippleRef.current?.endPress()}
    >
      {/* 涟漪层：铺满整行，位置与圆角由 .nav-item mdui-ripple 指定 */}
      <mdui-ripple ref={rippleRef as React.Ref<HTMLElement>}></mdui-ripple>
      <mdui-icon name={icon} aria-hidden="true"></mdui-icon>
      <span>{label}</span>
    </Link>
  );
}

export default function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = normalize(usePathname() ?? '/');
  const groups = getGroupedTools();

  return (
    <nav className="side-nav" aria-label="主导航">
      <NavItem
        href="/"
        icon={ICONS.home}
        label="首页"
        active={pathname === '/'}
        onNavigate={onNavigate}
      />

      <h2 className="nav-title">工具</h2>

      {groups.map((group) => (
        <section key={group.key} className="nav-group" aria-label={group.label}>
          <h3 className="nav-subtitle">{group.label}</h3>
          <ul className="nav-list">
            {group.tools.map((tool) => {
              const href = toolPath(tool.slug);
              return (
                <li key={tool.slug}>
                  <NavItem
                    href={href}
                    icon={tool.icon}
                    label={tool.name}
                    active={pathname === normalize(href)}
                    onNavigate={onNavigate}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
