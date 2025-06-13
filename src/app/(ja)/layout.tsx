import '@/app/(ja)/common.css';

import '@/app/globals.css';

import { Metadata } from 'next';

import { URL_ORIGIN } from '@/constants/meta';
import 'highlight.js/styles/github.css';

import { Inter } from 'next/font/google';

import { Comment, Console } from '@/components/Jokes';
import { Analytics } from '@/components/specific/Analytics';
import { DIALOG_PORTAL_ID } from '@/constants/id';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function JaRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <Suspense>
          <Analytics />
        </Suspense>
        <Console />
        <Comment />
      </head>
      <body className={inter.className} id="top">
        {children}
        <div id={DIALOG_PORTAL_ID} />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
