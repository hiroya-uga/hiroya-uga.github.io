import '@/app/(ja)/common.css';
import '@/app/globals.css';

import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

import { Comment } from '@/components/jokes/Comment';
import { Console } from '@/components/jokes/Console';
import { CookieConsentDialog } from '@/components/ui/dialogs/CookieConsentDialog';
import { Analytics } from '@/components/ui/features/Analytics';
import { LoadWebComponents } from '@/components/WebComponents';
import { DIALOG_PORTAL_ID, SVG_PORTAL_ID } from '@/constants/id';
import { URL_ORIGIN } from '@/constants/meta';
import { getTheme } from '@/utils/get-theme';

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = getTheme();

  return (
    <html lang="ja" data-theme={theme} suppressHydrationWarning>
      <head>
        <meta name="text-scale" content="scale" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=LINE+Seed+JP:wght@100;400;700;800&display=swap"
          rel="stylesheet"
        />

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
        <Script src="/common/scripts/init.js" strategy="beforeInteractive" />
      </head>
      <body id="top">
        <div id={DIALOG_PORTAL_ID} />
        {children}
        <Suspense>
          <CookieConsentDialog />
        </Suspense>
        <div id={SVG_PORTAL_ID} hidden />
      </body>
    </html>
  );
}
