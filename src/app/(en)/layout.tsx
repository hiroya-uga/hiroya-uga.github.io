'use client';

import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/lib/gtag';


const inter = Inter({ subsets: ['latin'] });

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className} id="top">
        {children}
      </body>
    </html>
  );
}
