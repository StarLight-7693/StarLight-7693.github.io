import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import AppShell from '@/components/layout/AppShell';
import MduiProvider from '@/components/mdui/MduiProvider';
import { SITE } from '@/data/site';
import { THEME_BOOTSTRAP } from '@/lib/theme';

// MDUI 的组件样式必须先于自研 SCSS 引入：
//   后声明者胜，我们的主题覆写才能压住它默认的紫。
import 'mdui/mdui.css';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.author }],
  icons: { icon: '/images/favicon.svg' },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    locale: 'zh_CN',
  },
};

/**
 * 生产构建走同步内联脚本，dev 走 next/script。
 *
 * 原因：React 19 在客户端渲染时遇到 <script> 会报
 *   "Scripts inside React components are never executed when rendering on the client"
 * 并跳过执行。静态导出（生产）的 HTML 由构建期 SSR 生成，浏览器解析即执行，
 * 首帧主题照常落地；真正被这条规则影响的是 dev（Turbopack 会在客户端重放 RSC 树），
 * 控制台会红一片。
 *
 * 生产不能换成 next/script：它的 beforeInteractive 在 App Router 里只是把
 * 脚本 push 进 self.__next_s 队列，要等 async chunk 加载后才执行，
 * 深色用户会先看到一闪白屏。所以两边分开处理：
 *   - 生产：内联 <script>，同步执行，零闪
 *   - dev：next/script（延迟执行）+ SSR 默认 mdui-theme-auto（跟随系统，先兜住首帧）
 */
const IS_PROD = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 生产：主题类由 <head> 里的内联脚本写入，React 不接管 className，
    //       否则每次重渲染都会把 class 冲回 SSR 时的空值。
    // dev：默认 mdui-theme-auto，让 MDUI 自己的 prefers-color-scheme 规则兜首帧。
    <html lang="zh-CN" className={IS_PROD ? undefined : 'mdui-theme-auto'} suppressHydrationWarning>
      <head>
        {/* 图标字体走 jsDelivr：预连接省掉 DNS/TCP/TLS，preload 让图标尽早成型 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://cdn.jsdelivr.net/npm/material-icons@1.13.14/iconfont/material-icons.woff2"
          crossOrigin="anonymous"
        />

        {/* 界面字体：HarmonyOS Sans SC（与冷域观者站同一套，按 unicode-range 分片，
            浏览器只取当前页面用得到的片） */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Regular.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Medium.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Bold.css"
        />

        {/* 代码字体：Cascadia Code 只有 Windows 11 自带，其它设备必须靠 webfont，
            否则会掉到系统 monospace，中英混排的行高直接崩 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@5.2.3/index.min.css"
        />

        {/* 首帧落地主题，避免深色用户先看到白屏（两条路径的原因见 IS_PROD 注释） */}
        {IS_PROD ? (
          <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        ) : (
          <Script id="theme-bootstrap" strategy="beforeInteractive">
            {THEME_BOOTSTRAP}
          </Script>
        )}
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <MduiProvider />
      </body>
    </html>
  );
}
