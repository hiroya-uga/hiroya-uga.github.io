'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { counterApi } from '@/api';
import { initGA, sendPageview } from '@/utils/cookie-consent';

import { useReportWebVitals } from 'next/web-vitals';

export const Analytics = () => {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams() ?? '';

  useEffect(() => {
    if (!pathname) {
      return;
    }

    // 保存済みの同意は再訪時にここで反映する。初回の同意は applyCookieConsent が扱う
    initGA();
    sendPageview();
  }, [pathname, searchParams]);

  // アクセスカウンター
  useEffect(() => {
    void counterApi.increment();
  }, []);

  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric);
    }
  });

  return null;
};
