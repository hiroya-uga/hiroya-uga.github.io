'use client';

import { useEffect } from 'react';

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    // TODO: root layout に html 要素がないと再レンダリングが無限に起こる可能性があり暫定対応。
    document.documentElement.lang = 'en';

    return () => {
      document.documentElement.lang = 'ja';
    };
  }, []);

  return <>{children}</>;
}
