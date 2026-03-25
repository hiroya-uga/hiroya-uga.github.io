import '@/app/(ja)/common.css';
import '@/app/globals.css';

import { Metadata } from 'next';
import { Suspense } from 'react';

import { CookieConsentDialog } from '@/components/Dialog';
import { Analytics } from '@/components/Layout/Analytics';
import { Comment, Console } from '@/components/Layout/Jokes';
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
          href="https://fonts.googleapis.com/css2?family=LINE+Seed+JP:wght@100;400;700&display=swap"
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const theme = JSON.parse(localStorage.getItem('theme'))?.value || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            } catch {}

            try {
              document.documentElement.setAttribute('data-cookie-consent', 'waiting');

              const state = (() => {
                if (/googlebot|lighthouse/i.test(navigator.userAgent)) {
                  localStorage.setItem('cookie-consent', '{"type":"primitive","value":"rejected"}');
                }
                return JSON.parse(localStorage.getItem('cookie-consent'))?.value || 'waiting';
              })();

              if (state !== 'waiting') {
                document.documentElement.removeAttribute('data-cookie-consent');
              } else {
                if (window.location.search.includes('utm_medium=social')) {
                  document.documentElement.setAttribute('data-cookie-consent', 'waiting-from-sns');
                }
              }
            } catch {}
          `.replaceAll(/\n|\s{2}/g, ''),
          }}
        />
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
