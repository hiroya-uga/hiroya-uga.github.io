'use client';

import { CookieConsentDialog } from '@/components/ui/dialogs/CookieConsentDialog';

import { Suspense, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function EnglishLayout({ children }: Readonly<Props>) {
  useEffect(() => {
    // TODO: root layout に html 要素がないと再レンダリングが無限に起こる可能性があり暫定対応。
    document.documentElement.lang = 'en';

    return () => {
      document.documentElement.lang = 'ja';
    };
  }, []);

  return (
    <>
      {children}

      <Suspense>
        <CookieConsentDialog lang="en" />
      </Suspense>
    </>
  );
}
