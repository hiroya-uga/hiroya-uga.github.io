'use client';

import { META } from '@/constants/meta';

import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="mt-48 pt-10 border-t border-t-gray-800 text-center px-3 pb-8">
      <p>
        <small>
          &copy;{' '}
          {pathname === '/' ? (
            META.siteName
          ) : (
            <a href="/" className="text-inherit">
              {META.siteName}
            </a>
          )}
        </small>
      </p>
    </footer>
  );
};
