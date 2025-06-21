'use client';

import { Fragment } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { SNS_LINKS } from '@/constants/sns';

const ListItem = () => {
  const pathname = usePathname() ?? '';
  const generatePaths = (path: string) => {
    const segments = path.replace(/^\/|\/$/g, '').split('/');

    return segments.map((_, index) => '/' + segments.slice(0, index + 1).join('/'));
  };
  const pathnames = [...generatePaths(pathname)];

  return (
    <>
      <li className='after:px-2 after:content-["/"]'>
        <Link href="/" className="leading-inherit text-inherit">
          HOME
        </Link>
      </li>

      {pathnames.map((path, index) => {
        if (path in SEO) {
          if (index === pathnames.length - 1) {
            return (
              <li key={path}>
                <a aria-current="page" className="leading-inherit text-inherit">
                  {SEO[path].title}
                </a>
              </li>
            );
          }

          return (
            <li key={path} className='after:px-2 after:content-["/"]'>
              <Link href={path} className="leading-inherit text-inherit">
                {SEO[path].title}
              </Link>
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
    <div className={clsx([isTop ? 'mt-12 sm:mt-20' : 'mt-48', 'w-full'])}>
      {isTop || (
        <nav
          className="mx-auto max-w-structure bg-gray-200 px-content-inline py-4 text-sm lg:bg-transparent lg:py-5 lg:pl-(--v-spacing-content-inline) lg:pr-[calc(13.5rem+calc(var(--v-spacing-content-inline)*2))]"
          aria-label="サイト内の現在位置"
        >
          <ol className="flex flex-wrap gap-y-0.5 leading-normal">{<ListItem />}</ol>
        </nav>
      )}
      {/* Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう */}
      <footer
        className={clsx(isTop ? 'bg-[#575757] text-white sm:bg-inherit sm:text-inherit' : 'bg-[#575757] text-white')}
      >
        {!isTop && (
          <div className="relative mx-auto max-w-structure bg-(--color-background) px-content-inline">
            <div className="mx-auto py-4 text-center lg:absolute lg:bottom-full lg:right-[calc(var(--v-spacing-content-inline)-0.75rem)] lg:py-1">
              {/* m-0 for bootstrap pages */}
              <ul
                className="m-0 flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:gap-2 dark:invert"
                aria-label="SNSリンク"
              >
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
        <div className="mx-auto max-w-structure px-content-inline">
          <div
            className={clsx(
              isTop && 'mx-auto max-w-content',
              'flow-root border-t border-t-gray-400 py-12',
              'md:flex md:flex-wrap md:justify-center md:gap-6 md:pb-20 md:pt-7',
            )}
          >
            <ul className="text-xs md:flex md:grow md:flex-wrap md:justify-start md:gap-y-2">
              {FOOTER_LINK_LIST.map(({ href, title, target }, index) => {
                const className = clsx([
                  "float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0",
                  index === FOOTER_LINK_LIST.length - 1 && 'md:after:hidden',
                ]);

                return (
                  <li key={href} className={className}>
                    <Link
                      href={href}
                      className={clsx(['text-inherit', isTop === false && 'outline-white!'])}
                      target={target}
                      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                    >
                      {title}{' '}
                      {target === '_blank' ? (
                        isTop ? (
                          <>
                            <Image
                              src={`/common/images/icons/new-window-white.svg`}
                              alt="新しいタブで開く"
                              className="mb-[0.2em] ml-[0.2em] inline-block size-[1em] sm:hidden"
                              width={16}
                              height={16}
                            />
                            <Image
                              src={`/common/images/icons/new-window-black.svg`}
                              alt="新しいタブで開く"
                              className="mb-[0.2em] ml-[0.2em] hidden size-[1em] sm:inline-block"
                              width={16}
                              height={16}
                            />
                          </>
                        ) : (
                          <Image
                            src={`/common/images/icons/new-window-white.svg`}
                            alt="新しいタブで開く"
                            className="mb-[0.2em] ml-[0.2em] inline-block size-[1em]"
                            width={16}
                            height={16}
                          />
                        )
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="relative -top-1px float-left grid h-[1.90625rem] place-items-center text-center text-xs md:float-none md:h-auto">
              {/* text-[100%] for bootstrap pages */}
              <small className="text-[100%]">&copy; {SITE_NAME}</small>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
