/* eslint-disable @next/next/no-head-element */
import '@/app/(ja)/common.css';
import '@/app/globals.css';

import { Inter } from 'next/font/google';

import { CookieConsentDialog } from '@/components/Dialog';
import { Comment, Console } from '@/components/Jokes';
import { Analytics } from '@/components/specific/Analytics';
import { LoadWebComponents } from '@/components/WebComponents';
import { DIALOG_PORTAL_ID, SVG_PORTAL_ID } from '@/constants/id';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const DefaultRootLayout = ({ lang, children }: { lang: string; children: React.ReactNode }) => {
  return (
    <html lang={lang} data-cookie-consent="waiting" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <Comment />
        <Suspense>
          <Analytics />
          <Console />
          <LoadWebComponents />
        </Suspense>
        <script>
          {`
            try {
              const theme = JSON.parse(localStorage.getItem('theme'))?.value || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            } catch {}

            try {
              const state = (() => {
                if (/Googlebot|Lighthouse/.test(navigator.userAgent)) {
                  localStorage.setItem('cookie-consent', '{"type":"primitive","value":"rejected"}')
                }
                return JSON.parse(localStorage.getItem('cookie-consent'))?.value || 'waiting';
              })();

              if (state !== 'waiting') {
                document.documentElement.removeAttribute('data-cookie-consent');
              }
            } catch {}
          `.replace(/\n|\s{2}/g, '')}
        </script>
      </head>
      <body className={inter.className} id="top">
        {children}
        <CookieConsentDialog />
        <div id={DIALOG_PORTAL_ID} />
        <div id={SVG_PORTAL_ID} hidden />
      </body>
    </html>
  );
};
