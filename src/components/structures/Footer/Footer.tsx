'use client';

import { META } from '@/constants/meta';

import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="mt-48 px-8">
      <div className="border-t border-t-gray-400 py-10 text-center max-w-[960px] mx-auto sm:pb-12">
        <p className="text-xs">
          <small>
            &copy;{' '}
            {pathname === '/' ? (
              META.siteName
            ) : (
              <a href="/" className="text-inherit">
                {META.siteName}
              </a>
            )}
          </small>{' '}
          - <a href="https://github.com/hiroya-uga/hiroya-uga.github.io">GitHub</a>
        </p>
      </div>
    </footer>
  );
};
