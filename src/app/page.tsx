import FriendLinks from '@/components/home/FriendLinks';
import Hero from '@/components/home/Hero';
import ToolGrid from '@/components/home/ToolGrid';

// 首页：介绍 → 工具入口 → 友情链接。全部是静态内容（Server Component）。
export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section" id="tools" aria-labelledby="tools-title">
        <h2 className="section-title" id="tools-title">
          工具
        </h2>
        <p className="section-desc">点开即用，不需要安装，也不需要注册。</p>
        <ToolGrid />
      </section>

      <section className="section" id="friends" aria-labelledby="friends-title">
        <h2 className="section-title" id="friends-title">
          友情链接
        </h2>
        <p className="section-desc">部分链接可能会失效，我如果有时间会及时更新。</p>
        <FriendLinks />
      </section>
    </>
  );
}
