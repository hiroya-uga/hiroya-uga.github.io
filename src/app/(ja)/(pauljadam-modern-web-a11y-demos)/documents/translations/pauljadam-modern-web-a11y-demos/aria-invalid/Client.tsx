'use client';

import { DOMAIN_NAME } from '@/constants/meta';

import { usePathname } from 'next/navigation';

export const SelfLink = () => {
  const pathname = usePathname();
  const url = `https://${DOMAIN_NAME}${pathname}`;

  return (
    <p>
      <a href={url}>{url}</a>
    </p>
  );
};
