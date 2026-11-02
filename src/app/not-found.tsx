import Link from 'next/link';
import { SITE } from '@/data/site';

// 404：静态导出会输出 404.html，GitHub Pages 直接用它兜底。
export default function NotFound() {
  return (
    <section className="notfound">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">这里没有东西</h1>
      <p className="notfound-desc">页面可能已经被移除，或者链接拼错了。回首页看看有哪些工具吧。</p>
      <Link className="notfound-link" href="/">
        回到 {SITE.name}
      </Link>
    </section>
  );
}
