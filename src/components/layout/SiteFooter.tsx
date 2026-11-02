import { SITE } from '@/data/site';

// 年份在构建时算一次就够：本站是纯静态产物，每次部署都会重新构建。
// 不在 render 里调 new Date()，否则每次渲染都读系统时钟（React 会判为非纯函数）。
const YEAR = new Date().getFullYear();

// 全站页脚：版权、技术栈、许可。Server Component，无交互。
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-line">
        © {YEAR} {SITE.name}
      </p>
      <p className="site-footer-line is-muted">
        基于 {SITE.tech.join(' · ')} 构建 · {SITE.license} License
      </p>
    </footer>
  );
}
