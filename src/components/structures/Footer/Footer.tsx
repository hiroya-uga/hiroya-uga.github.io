'use client';

import { Fragment, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { SNS_LINKS } from '@/constants/sns';

const Anchor = ({ href, children }: { href: string; children: React.ReactNode }) => {
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
      <Link href={href} className="leading-inherit text-inherit">
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className="leading-inherit text-inherit">
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
  const pathnames = [...generatePaths(pathname)];

  return (
    <>
      <li className='after:px-2 after:content-["/"]'>
        <Anchor href="/">HOME</Anchor>
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
              <Anchor href={path}>{SEO[path].title}</Anchor>
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
          className="mx-auto max-w-structure bg-gray-200 px-[var(--content-padding-inline)] py-4 text-sm lg:bg-transparent lg:py-5 lg:pl-[var(--content-padding-inline)] lg:pr-[calc(13.5rem_+_calc(var(--content-padding-inline)_*_2))]"
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
          <div className="relative mx-auto max-w-structure bg-[var(--color-background)] px-[var(--content-padding-inline)]">
            <div className="mx-auto py-4 text-center lg:absolute lg:bottom-full lg:right-[calc(var(--content-padding-inline)_-_0.75rem)] lg:py-1">
              {/* m-0 for bootstrap pages */}
              <ul
                className="m-0 flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:gap-2"
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
        <div className="mx-auto max-w-structure px-[var(--content-padding-inline)]">
          <div
            className={clsx(
              isTop && 'mx-auto max-w-content',
              'flow-root border-t border-t-gray-400 py-12',
              'md:flex md:flex-wrap md:justify-center md:gap-6 md:pb-20 md:pt-7',
            )}
          >
            <ul className="text-xs md:flex md:grow md:flex-wrap md:justify-start md:gap-y-2">
              <li className="float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0">
                <a href="/about" className={clsx(['text-inherit', isTop === false && '!outline-white'])}>
                  当サイトおよび管理人について
                </a>
              </li>
              <li className="float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0">
                <a href="/privacy-policy" className={clsx(['text-inherit', isTop === false && '!outline-white'])}>
                  プライバシーポリシー
                </a>
              </li>
              <li className="float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0">
                <a href="/disclaimer" className={clsx(['text-inherit', isTop === false && '!outline-white'])}>
                  免責事項
                </a>
              </li>
              <li className="float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0">
                <a href="/contact" className={clsx(['text-inherit', isTop === false && '!outline-white'])}>
                  お問い合わせ
                </a>
              </li>
              <li className="float-left py-1 after:mx-2.5 after:content-['|'] md:float-none md:p-0 md:after:hidden">
                <a
                  href="https://github.com/hiroya-uga/hiroya-uga.github.io/issues"
                  className={clsx(['text-inherit', isTop === false && '!outline-white'])}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  フィードバック{' '}
                  {isTop ? (
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
                  )}
                </a>
              </li>
            </ul>
            <p className="relative top-[-0.0625rem] float-left grid h-[1.90625rem] place-items-center text-center text-xs md:float-none md:h-auto">
              {/* text-[100%] for bootstrap pages */}
              <small className="text-[100%]">&copy; {SITE_NAME}</small>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
