import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '恋爱聊天神器 - 让每句话都说到心坎里',
  description: '智能恋爱聊天助手，帮你生成最合适的回复内容，让聊天更有趣更有魅力',
  keywords: '恋爱,聊天,回复,AI助手,情话,撩妹,撩汉',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}