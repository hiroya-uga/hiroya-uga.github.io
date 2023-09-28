'use client';

import { META } from '@/constants/meta';

import { usePathname } from 'next/navigation';

export const SelfLink = () => {
  const pathname = usePathname();
  const url = `https://${META.domain}${pathname}`;

  return (
    <p>
      <a href={url}>{url}</a>
    </p>
  );
};
