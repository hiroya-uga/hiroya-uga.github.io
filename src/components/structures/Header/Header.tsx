'use client';

import Link from 'next/link';

import { SiteName } from '@/components/structures/Header/SiteName';
import clsx from 'clsx';

import styles from '@/components/structures/Header/Header.module.css';

export const Header = () => {
  return (
    <header className="mb-[var(--header-margin-bottom)]">
      <SiteName />

      <div className="mt-8 px-4  sm:pl-10 sm:pt-8 2xl:pt-16">
        <div className="relative mx-auto max-w-structure">
          <p className="relative -left-4 -top-2 2xl:left-0">
            <Link
              href="../"
              className="group inline-block rounded-md px-4 py-2 no-underline transition-colors delay-0 duration-300 sm:hover:bg-white sm:focus:bg-white"
            >
              <span className="underline">../</span>
              <span
                className={clsx([
                  styles.opacity0,
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
