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

    const url = pathname + searchParams.toString();

    ReactGA.initialize(GA_MEASUREMENT_ID);
    ReactGA.send({
      hitType: 'pageview',
      page: url,
    });
  }, [pathname, searchParams]);

  return null;
};
