'use client';

import Link from 'next/link';

import { SiteName } from '@/components/structures/Header/SiteName';
import clsx from 'clsx';

import styles from '@/components/structures/Header/Header.module.css';

export const Header = ({ layout = 'common' }: { layout?: 'common' | 'wide-content' }) => {
  return (
    <header className={clsx(styles.root, 'mb-(--v-header-margin-bottom) text-text')}>
      <SiteName />

      <div className="mt-8 px-4 sm:pl-10 sm:pt-8 2xl:pt-16">
        <div className="max-w-structure relative mx-auto">
          <p className={clsx(['relative -left-4 -top-2', layout === 'common' && '2xl:left-0'])}>
            <Link
              href="../"
              className="hover:text-link sm:hover:bg-banner sm:focus:bg-banner group inline-block rounded-md px-4 py-2 no-underline transition-colors delay-0 duration-300"
            >
              <span className="underline" translate="no">
                ../
              </span>
              <span
                className={clsx([
                  'pointer-fine:opacity-0',
                  'ml-2.5 transition-opacity delay-0 duration-300 group-hover:opacity-100 group-focus:opacity-100',
                ])}
              >
                １つ上のページへ戻る
              </span>
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
};
