import Link from 'next/link';
import { ICONS } from '@/data/icons';
import { toolPath } from '@/data/site';
import { getGroupedTools } from '@/data/tools';

// 首页工具入口：按分类分组铺卡片，点击进各自工具页。
export default function ToolGrid() {
  const groups = getGroupedTools();

  return (
    <div className="tool-groups">
      {groups.map((group) => (
        <section key={group.key} className="tool-group" aria-labelledby={`group-${group.key}`}>
          <h3 className="tool-group-title" id={`group-${group.key}`}>
            {group.label}
          </h3>

          <div className="tool-grid">
            {group.tools.map((tool) => (
              <Link key={tool.slug} className="tool-card" href={toolPath(tool.slug)}>
                <span className="tool-card-icon" aria-hidden="true">
                  <mdui-icon name={tool.icon}></mdui-icon>
                </span>
                <span className="tool-card-body">
                  <span className="tool-card-name">{tool.name}</span>
                  <span className="tool-card-desc">{tool.desc}</span>
                </span>
                <mdui-icon
                  name={ICONS.chevronRight}
                  className="tool-card-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
