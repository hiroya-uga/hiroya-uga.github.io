'use client';

import '@/app/(ja)/common.css';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/lib/gtag';
import { Comment } from '@/components/Jokes';

const inter = Inter({ subsets: ['latin'] });

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <Comment />

        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className} id="top">
        {children}
      </body>
    </html>
  );
}
