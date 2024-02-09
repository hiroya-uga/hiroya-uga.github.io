'use client';

import { URL_ORIGIN } from '@/constants/meta';

import { usePathname } from 'next/navigation';

export const SelfLink = () => {
  const pathname = usePathname();
  const url = `${URL_ORIGIN}${pathname}`;

  return (
    <p>
      <a href={url}>{url}</a>
    </p>
  );
};
