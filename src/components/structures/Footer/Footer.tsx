'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { SNS_LINKS } from '@/constants/sns';
import { SEO } from '@/constants/seo';
import { SITE_NAME } from '@/constants/meta';

const Anchor = ({ href, className, children }: { href: string; className: string; children: React.ReactNode }) => {
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
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const ListItem = () => {
  const pathname = usePathname() ?? '';
  const generatePaths = (path: string) => {
    const segments = path.replace(/^\/|\/$/g, '').split('/');

    return segments.map((_, index) => '/' + segments.slice(0, index + 1).join('/'));
  };
  const pathnames = ['/', ...generatePaths(pathname)];

  return (
    <>
      {pathnames.map((path, index) => {
        if (path in SEO) {
          if (index === pathnames.length - 1) {
            return (
              <li key={path}>
                <a aria-current="page" className="text-inherit">
                  {SEO[path]}
                </a>
              </li>
            );
          }

          return (
            <li key={path} className='after:px-2 after:content-["/"]'>
              <Anchor href={path} className="text-inherit">
                {SEO[path]}
              </Anchor>
            </li>
          );
        }

        return <Fragment key={path} />;
      })}
    </>
  );
};

export const Footer = () => {
  const pathname = usePathname();
  const isTop = pathname === '/';

  return (
    <div
      className={clsx([
        isTop ? 'mt-12 sm:mt-20' : 'mt-48',
        'relative mx-auto w-full max-w-structure lg:px-[var(--content-padding-inline)]',
      ])}
    >
      {isTop || (
        <nav className="bg-gray-200 px-[var(--content-padding-inline)] py-4 text-sm lg:min-h-[3.75rem] lg:bg-transparent lg:pl-[var(--content-padding-inline)] lg:pr-[calc(13.5rem_+_calc(var(--content-padding-inline)_*_2))]">
          <ol className="flex flex-wrap gap-y-1 leading-snug">{<ListItem />}</ol>
        </nav>
      )}
      {/* Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう */}
      <footer>
        {!isTop && (
          <div className="px-[var(--content-padding-inline)] lg:px-[calc(var(--content-padding-inline)_*_2)]">
            <div className="mx-auto py-4 text-center lg:absolute lg:right-[calc(var(--content-padding-inline)_*_2)] lg:top-0 lg:pt-1">
              {/* m-0 for bootstrap pages */}
              <ul className="m-0 flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:gap-2">
                {SNS_LINKS.map(({ href, alt, ...props }) => {
                  return (
                    <li key={href}>
                      <a href={href} className="group block rounded-lg p-3 transition-bg hover:bg-gray-200">
                        <Image {...props} width={28} height={28} alt={alt} className="size-7" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        <div className="px-[var(--content-padding-inline)]">
          <div
            className={clsx(isTop && 'max-w-content', 'mx-auto border-t border-t-gray-400 py-10 text-center sm:pb-12')}
          >
            <p className="text-xs">
              {/* text-[100%] for bootstrap pages */}
              <small className="text-[100%]">
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
        </div>
      </footer>
    </div>
  );
};
