import '@/app/(ja)/common.css';

import '@/app/globals.css';

import { Metadata } from 'next';

import { URL_ORIGIN } from '@/constants/meta';
import 'highlight.js/styles/github.css';

import { Inter } from 'next/font/google';

import { Comment, Console } from '@/components/Jokes';
import GoogleAnalytics from '@/lib/gtag';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <Console />
        <Comment />
      </head>
      <body className={inter.className} id="top">
        {children}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};
