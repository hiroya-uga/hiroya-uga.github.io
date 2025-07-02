'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const Analytics = () => {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams() ?? '';

  useEffect(() => {
    if (GA_MEASUREMENT_ID === '' || !pathname) {
      return;
    }

    ReactGA.send({ hitType: 'pageview', page: pathname + searchParams.toString() });
  }, [pathname, searchParams]);

  return null;
};
