'use client';

import Link from 'next/link';

import { SiteName } from '@/components/structures/Header/SiteName';
import clsx from 'clsx';

import styles from '@/components/structures/Header/Header.module.css';
import { ThemeSwitch } from '@/components/structures/ThemeSwitch';

export const Header = ({ layout = 'common' }: { layout?: 'common' | 'wide-content' | 'article-content' }) => {
  return (
    <header className={clsx([styles.root, '@container text-primary'])}>
      <SiteName />

      <p className="@w1520:fixed @w1520:top-2 @w1520:right-2 @w1520:z-50 ml-auto w-fit pr-2 pt-2">
        <ThemeSwitch />
      </p>

      <div
        className={clsx([
          '@w1280:pl-10 @w1520:pt-16 my-4 px-4 sm:pt-8',
          layout !== 'article-content' && 'mb-(--v-header-margin-bottom)',
        ])}
      >
        <div className="max-w-structure relative mx-auto">
          <p data-class-name={clsx(['relative -left-3 -top-2', layout === 'common' && '@w1520:left-0'])}>
            <Link
              href="../"
              className="hover:text-link sm:hover:bg-secondary sm:focus:bg-secondary group inline-block rounded-md px-4 py-2 no-underline transition-colors delay-0 duration-300"
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
