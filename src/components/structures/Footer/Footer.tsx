'use client';

import { SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { SNS_LINKS } from '@/constants/sns';

import clsx from 'clsx';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const ListItem = () => {
  const pathname = usePathname() ?? '';
  const generatePaths = (path: string) => {
    const cleanedPath = path.replace(/^\/|\/$/g, '');
    const segments = cleanedPath.split('/');

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
              <a href={path} className="text-inherit">
                {SEO[path]}
              </a>
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
    <div className={clsx([isTop ? 'mt-12 sm:mt-20' : 'mt-48', 'relative'])}>
      {isTop || (
        <nav className="bg-gray-200 px-[16px] py-4 text-sm lg:min-h-[3.75rem] lg:bg-transparent lg:pl-[32px] lg:pr-[calc(13.5rem_+_32px)]">
          <ol className="flex flex-wrap gap-y-1 leading-snug">{<ListItem />}</ol>
        </nav>
      )}
      {/* Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう */}
      <footer>
        {!isTop && (
          <div className="px-[16px] lg:px-[32px]">
            <div className="mx-auto py-8 text-center lg:absolute lg:right-[32px] lg:top-0 lg:py-4">
              {/* m-0 for bootstrap pages */}
              <ul className="m-0 flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:gap-6">
                {SNS_LINKS.map(({ href, alt, ...props }) => {
                  return (
                    <li key={href}>
                      <a href={href} className="block rounded">
                        <Image {...props} width={32} height={32} alt={alt} className="size-7 lg:size-7" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
        <div className="px-[16px]">
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
