import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: '栖小光的工具站',
  description: '一堆纯前端小工具，数据不上传服务器。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
