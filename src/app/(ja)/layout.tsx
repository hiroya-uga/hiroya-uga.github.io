'use client';

import '@/app/(ja)/common.css';

import { Inter } from 'next/font/google';

import { Comment } from '@/components/Jokes';
import GoogleAnalytics from '@/lib/gtag';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <Comment />

        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className={inter.className} id="top">
        {children}
      </body>
    </html>
  );
}
