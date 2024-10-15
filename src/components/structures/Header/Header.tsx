'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteName } from '@/components/structures/Header/SiteName';

const Anchor = ({ className, children }: { className: string; children: React.ReactNode }) => {
  const pathname = usePathname() ?? '';
  const [shouldLinkComponent, setShouldLinkComponent] = useState(false);

  useEffect(() => {
    setShouldLinkComponent(
      ![/fantasized-specs/, /pauljadam-modern-web-a11y-demos/].some((regexp) => regexp.test(pathname)),
    );
  }, [pathname]);

  if (shouldLinkComponent) {
    // Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう
    return (
      <Link href="../" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href="../" className={className}>
      {children}
    </a>
  );
};

export const Header = () => {
  return (
    <header>
      <SiteName />

      <div className="px-4 py-8 sm:pb-16 sm:pl-10 sm:pt-8 2xl:pt-16">
        <div className="relative mx-auto max-w-structure">
          <p className="relative -left-4 -top-2 2xl:left-0">
            <Anchor className="group inline-block rounded-md px-4 py-2 no-underline lg:transition-colors lg:delay-0 lg:duration-300 lg:hover:bg-white lg:focus:bg-white">
              <span className="underline">../</span>
              <span className="ml-4 group-hover:opacity-100 group-focus:opacity-100 lg:opacity-0 lg:transition-opacity lg:delay-0 lg:duration-300">
                １つ上のページへ戻る
              </span>
            </Anchor>
          </p>
        </div>
      </div>
    </header>
  );
};
