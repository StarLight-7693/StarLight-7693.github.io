import { SITE } from '@/data/site';

// 首页 Hero：站名 + 简介 + 两条硬信息。纯静态，无交互。
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero-eyebrow">纯前端 · 免登录 · 不收集数据</p>
      <h1 className="hero-title" id="hero-title">
        {SITE.name}
      </h1>
      <p className="hero-desc">{SITE.description}</p>
      <ul className="hero-points">
        <li>所有计算都在你的浏览器里完成，输入内容不会上传到任何服务器。</li>
        <li>纯静态站点，断网也能打开（图标字体除外）。</li>
        <li>开源，代码托管在 GitHub。</li>
      </ul>
    </section>
  );
}
