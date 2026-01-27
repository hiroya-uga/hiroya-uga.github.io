import '@/app/(ja)/common.css';
import '@/app/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import { CookieConsentDialog } from '@/components/Dialog';
import { Comment, Console } from '@/components/Jokes';
import { Analytics } from '@/components/specific/Analytics';
import { LoadWebComponents } from '@/components/WebComponents';
import { DIALOG_PORTAL_ID, SVG_PORTAL_ID } from '@/constants/id';
import { URL_ORIGIN } from '@/constants/meta';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_ORIGIN),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" data-cookie-consent="waiting" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
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
              const state = (() => {
                if (/Googlebot|Lighthouse/.test(navigator.userAgent)) {
                  localStorage.setItem('cookie-consent', '{"type":"primitive","value":"rejected"}')
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
      <body className={inter.className} id="top">
        {children}
        <Suspense>
          <CookieConsentDialog />
        </Suspense>
        <div id={DIALOG_PORTAL_ID} />
        <div id={SVG_PORTAL_ID} hidden />
      </body>
    </html>
  );
}
