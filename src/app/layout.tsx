import '@/app/(ja)/common.css';
import '@/app/globals.css';

import { Metadata } from 'next';
import { LINE_Seed_JP } from 'next/font/google';
import fs from 'node:fs';
import path from 'node:path';
import { Suspense } from 'react';

import { Comment } from '@/components/jokes/Comment';
import { Console } from '@/components/jokes/Console';
import { Analytics } from '@/components/ui/features/Analytics';
import { LoadWebComponents } from '@/components/WebComponents';
import { BODY_ELEMENT_ID, DIALOG_PORTAL_ID, SVG_PORTAL_ID } from '@/constants/id';
import { URL_ORIGIN } from '@/constants/meta';
import { getTheme } from '@/utils/get-theme';

const lineSeedJp = LINE_Seed_JP({
  weight: ['100', '400', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-line-seed-jp',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
  icons: {
    icon: '/favicon.png',
  },
};

const initScript = fs.readFileSync(path.join(process.cwd(), 'src/scripts/init.js'), 'utf8').replaceAll(/\n|\s{2}/g, '');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = getTheme();

  return (
    <html lang="ja" data-theme={theme} className={lineSeedJp.variable} suppressHydrationWarning>
      <head>
        <meta name="text-scale" content="scale" />

        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />

        <Comment />
        <Suspense>
          <Analytics />
          <Console />
          <LoadWebComponents />
        </Suspense>

        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body id={BODY_ELEMENT_ID}>
        <div id={DIALOG_PORTAL_ID} />
        {children}

        <div id={SVG_PORTAL_ID} hidden />
      </body>
    </html>
  );
}
