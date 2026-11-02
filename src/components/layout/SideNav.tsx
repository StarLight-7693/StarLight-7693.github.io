'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ICONS } from '@/data/icons';
import { toolPath } from '@/data/site';
import { getGroupedTools } from '@/data/tools';

// ============================================================
// 侧栏导航
// ------------------------------------------------------------
// 结构：首页 + 「工具」分组（组内按 category 再分组）。
//
// 为什么用 <Link> 而不是 mdui-list-item 的 href：
//   list-item 一旦设 href 就会自己渲染 <a>，点击是整页刷新，
//   会丢掉 Next 的客户端路由与滚动恢复。这里用 Link + 自绘行，
//   视觉（圆角、悬停底色、选中容器色）全部取自 MDUI 令牌。
// ============================================================

/** 去掉尾斜杠再比较，兼容 trailingSlash 的两种返回形态 */
function normalize(path: string): string {
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export default function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = normalize(usePathname() ?? '/');
  const groups = getGroupedTools();

  const linkClass = (active: boolean) => (active ? 'nav-item is-active' : 'nav-item');

  return (
    <nav className="side-nav" aria-label="主导航">
      <Link
        className={linkClass(pathname === '/')}
        href="/"
        aria-current={pathname === '/' ? 'page' : undefined}
        onClick={onNavigate}
      >
        <mdui-icon name={ICONS.home} aria-hidden="true"></mdui-icon>
        <span>首页</span>
      </Link>

      <h2 className="nav-title">工具</h2>

      {groups.map((group) => (
        <section key={group.key} className="nav-group" aria-label={group.label}>
          <h3 className="nav-subtitle">{group.label}</h3>
          <ul className="nav-list">
            {group.tools.map((tool) => {
              const href = toolPath(tool.slug);
              const active = pathname === normalize(href);
              return (
                <li key={tool.slug}>
                  <Link
                    className={linkClass(active)}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={onNavigate}
                  >
                    <mdui-icon name={tool.icon} aria-hidden="true"></mdui-icon>
                    <span>{tool.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
