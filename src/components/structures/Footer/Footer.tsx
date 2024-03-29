'use client';

import { SITE_NAME } from '@/constants/meta';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export const Footer = () => {
  const pathname = usePathname();
  const isTop = pathname === '/';

  return (
    // Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう
    <footer className={clsx([isTop ? 'mt-12 sm:mt-20' : 'mt-48', 'px-[16px]'])}>
      <div className="mx-auto max-w-content border-t border-t-gray-400 py-10 text-center sm:pb-12">
        <p className="text-xs">
          <small>
            &copy;{' '}
            {isTop ? (
              SITE_NAME
            ) : (
              <a href="/" className="text-inherit">
                {SITE_NAME}
              </a>
            )}
          </small>{' '}
          - <a href="https://github.com/hiroya-uga/hiroya-uga.github.io">GitHub</a>
        </p>
      </div>
    </footer>
  );
};
