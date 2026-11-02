import type { Metadata } from 'next';
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 主题类由 <head> 里的内联脚本写入，React 不接管 className，
    // 否则每次重渲染都会把 class 冲回 SSR 时的空值。
    <html lang="zh-CN" suppressHydrationWarning>
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
        {/* 首帧落地主题，避免深色用户先看到白屏 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
        <MduiProvider />
      </body>
    </html>
  );
}
