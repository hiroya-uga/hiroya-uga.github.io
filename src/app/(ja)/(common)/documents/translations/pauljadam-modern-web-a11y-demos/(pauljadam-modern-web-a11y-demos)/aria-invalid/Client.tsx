'use client';

import { usePathname } from 'next/navigation';

import { URL_ORIGIN } from '@/constants/meta';

export const SelfLink = () => {
  const pathname = usePathname();
  const url = `${URL_ORIGIN}${pathname}`;

  return (
    <p>
      <a href={url}>{url}</a>
    </p>
  );
};
