'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

// ============================================================
// 404
// ------------------------------------------------------------
// 静态导出会产出 404.html，GitHub Pages 直接用它兜底。
//
// 内容沿用源站同一个彩蛋：一句随机理由 + B 站 iframe（点开就知道是什么），
// 下面附上这个梗的来历。iframe 用 aspect-ratio 撑成 16:9 并限宽，
// 窄屏也不会撑出横向滚动。
//
// 随机理由不能直接在渲染期算：SSG 阶段与客户端水合各抽一次会不一致，
// 所以先给固定值，挂载后再换成随机结果。
// ============================================================

const ERR_REASONS = [
  '跑丢了',
  '飞走了',
  '去玩蛋仔派对了',
  '去玩逃跑吧少年了',
  '去玩Minecraft了',
  '去玩保卫萝卜4了',
  '去玩PVZ2了',
  '被Rick Astley骗走了',
];

// 随机理由不能直接在渲染期算：SSG 阶段与客户端水合各抽一次会不一致。
// 也不用 state —— 这句只是装饰文案，挂载后直接改这一行文本即可，
// 免得为一个句子触发一次多余的重渲染。
const DEFAULT_REASON = ERR_REASONS[0];

const RICKROLL_SRC =
  'https://player.bilibili.com/player.html?isOutside=true&aid=80433022&bvid=BV1GJ411x7h7&cid=137649199&p=1';

export default function NotFound() {
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    const reason = ERR_REASONS[Math.floor(Math.random() * ERR_REASONS.length)] ?? DEFAULT_REASON;
    el.textContent = `你想要看的页面${reason}，我找不到它`;
  }, []);

  return (
    <section className="notfound">
      <h1 className="notfound-title">找不到页面</h1>

      <p className="notfound-desc" ref={descRef}>
        你想要看的页面{DEFAULT_REASON}，我找不到它
      </p>

      <iframe
        className="notfound-player"
        src={RICKROLL_SRC}
        title="404 彩蛋"
        allowFullScreen
        loading="lazy"
      />

      <Link className="notfound-link" href="/">
        返回首页
      </Link>

      <p className="notfound-egg">
        你知道吗？“你被骗了”是 2021
        年在网络平台广泛传播的网络流行语，其表现形式为通过具有误导性的标题或封面吸引用户点击，实际内容却跳转至瑞克·艾斯利（Rick
        Astley）的《Never Gonna Give You Up》音乐视频。该现象因 2021 年 11
        月前后相关恶搞视频的大量传播而再次流行。
      </p>
    </section>
  );
}
