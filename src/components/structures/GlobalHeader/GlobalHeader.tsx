'use client';

import Link from 'next/link';

import { SiteName } from '@/components/structures/GlobalHeader/SiteName';
import clsx from 'clsx';

import styles from '@/components/structures/GlobalHeader/GlobalHeader.module.css';
import { ThemeSwitch } from '@/components/structures/ThemeSwitch';
import { usePathname } from 'next/navigation';

export const GlobalHeader = ({ layout = 'common' }: { layout?: 'common' | 'wide-content' | 'article-content' }) => {
  const lang = usePathname().endsWith('/en/') ? 'en' : 'ja';

  return (
    <header className={clsx([styles.root, '@container text-primary'])}>
      <SiteName />

      <p className="@w1520:fixed @w1520:top-2 @w1520:right-2 @w1520:z-50 ml-auto w-fit pr-2 pt-2">
        <ThemeSwitch />
      </p>

      <div
        className={clsx([
          '@w1520:pt-16 px-content-inline my-4 sm:pt-8',
          layout !== 'article-content' && 'mb-(--v-header-margin-bottom)',
        ])}
      >
        <div className="max-w-structure relative mx-auto">
          <p className={clsx(['-left-16PX relative -top-2', layout === 'common' && '@w1520:left-0'])}>
            <Link
              href="../"
              className="hover:text-link sm:hover:bg-secondary sm:focus:bg-secondary px-16PX group inline-block rounded-md py-2 no-underline transition-colors delay-0 duration-300"
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
                {lang === 'en' ? 'Go up one level' : '１つ上のページへ戻る'}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
};
