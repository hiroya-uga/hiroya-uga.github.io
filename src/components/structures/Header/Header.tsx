'use client';

import { SiteName } from '@/components/structures/Header/SiteName';

import { useEffect, useState } from 'react';

import Link from 'next/link';

const Anchor = () => {
  const [shouldLinkComponent, setShouldLinkComponent] = useState(false);

  useEffect(() => {
    setShouldLinkComponent(
      ![/fantasized-specs/, /pauljadam-modern-web-a11y-demos/].some((regexp) => regexp.test(location.pathname)),
    );
  }, []);

  if (shouldLinkComponent) {
    // Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう
    return (
      <Link
        href="../"
        data-id="hoge"
        className="group inline-block rounded-md px-4 py-2 no-underline sm:transition-colors sm:delay-0 sm:duration-300 sm:hover:bg-white sm:focus:bg-white"
      >
        <span className="underline">../</span>
        <span className="ml-4 group-hover:opacity-100 group-focus:opacity-100 sm:opacity-0 sm:transition-opacity sm:delay-0 sm:duration-300">
          １つ上のページへ戻る
        </span>
      </Link>
    );
  }

  return (
    <a
      href="../"
      className="group inline-block rounded-md px-4 py-2 no-underline sm:transition-colors sm:delay-0 sm:duration-300 sm:hover:bg-white sm:focus:bg-white"
    >
      <span className="underline">../</span>
      <span className="ml-4 group-hover:opacity-100 group-focus:opacity-100 sm:opacity-0 sm:transition-opacity sm:delay-0 sm:duration-300">
        １つ上のページへ戻る
      </span>
    </a>
  );
};

export const Header = () => {
  return (
    <header>
      <SiteName />

      <div className="px-4 py-8 sm:py-16 sm:pl-10">
        <div className="relative mx-auto max-w-structure">
          <p className="relative -left-4 -top-2">
            <Anchor />
          </p>
        </div>
      </div>
    </header>
  );
};
