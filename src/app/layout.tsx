'use client';

import '@/app/globals.css';
import GoogleAnalytics from '@/lib/gtag';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function DocumentLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className} id="top">
        {children}
      </body>
    </html>
  );
}
