'use client';

import { Fragment } from 'react';

import { Picture } from '@/components/Image';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SvgIcon } from '@/components/Icons';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';
import { SNS_LINKS } from '@/constants/sns';

import styles from '@/components/structures/GlobalFooter/GlobalFooter.module.css';
import { OPEN_NEW_TAB } from '@/constants/messages';
import { Lang } from '@/types/lang';

const ListItem = ({ additionalBreadcrumbs, currentPageTitle }: Props) => {
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
                  {pathname.endsWith('/en/') ? 'English version' : SEO[path].title}
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

      {additionalBreadcrumbs?.map(({ title, href }) => (
        <li key={href} className='after:px-2 after:content-["/"]'>
          <Link href={href} className="leading-inherit text-inherit">
            {title}
          </Link>
        </li>
      ))}

      {currentPageTitle && (
        <li>
          <a aria-current="page" className="leading-inherit text-inherit">
            {pathname.endsWith('/en/') ? 'English version' : currentPageTitle}
          </a>
        </li>
      )}
    </>
  );
};

type Props = {
  additionalBreadcrumbs?: { title: string; href: string }[];
  currentPageTitle?: string;
};

const i18n = {
  ja: {
    breadcrumb: 'サイト内の現在位置',
    snsLinks: 'SNSリンク',
  },
  en: {
    breadcrumb: 'Current location within the site',
    snsLinks: 'SNS Links',
  },
} satisfies Record<Lang, unknown>;

export const GlobalFooter = ({ additionalBreadcrumbs, currentPageTitle }: Props) => {
  const pathname = usePathname();
  const isTop = pathname === '/';
  const lang = pathname.endsWith('/en/') ? 'en' : 'ja';

  const t = i18n[lang];

  return (
    <>
      {isTop || (
        <nav className={clsx(['@container mt-[20vh]', styles.breadcrumb])} aria-label={t.breadcrumb}>
          <div className="max-w-structure px-content-inline @w1024:pl-(--x-spacing-content-inline) bg-(--x-color-background-breadcrumb) @w1024:bg-transparent @w1024:py-5 @w1024:pr-[calc(13.5rem+calc(var(--x-spacing-content-inline)*2))] mx-auto py-4 text-sm">
            <ol className="flex flex-wrap gap-y-0.5 leading-normal">
              {<ListItem additionalBreadcrumbs={additionalBreadcrumbs} currentPageTitle={currentPageTitle} />}
            </ol>
          </div>
        </nav>
      )}
      {/* Linkコンポーネントを使うと別レイアウト階層に移動した時に layout.css が引き継がれてしまう */}
      <footer className={clsx(['@container', styles.footer])}>
        <div className={clsx([isTop || 'bg-(--x-color-background-footer) text-(--x-color-text-footer)'])}>
          {!isTop && (
            <div className="max-w-structure bg-secondary px-content-inline relative mx-auto">
              <div className="@w1024:absolute @w1024:bottom-full @w1024:right-[calc(var(--x-spacing-content-inline)-0.75rem)] @w1024:py-1 mx-auto py-4 text-center">
                {/* m-0 for bootstrap pages */}
                <ul
                  className="@w1024:justify-end @w1024:gap-2 m-0 flex flex-wrap items-center justify-center gap-4 dark:invert"
                  aria-label={t.snsLinks}
                >
                  {SNS_LINKS.map(({ href, alt, ...props }) => {
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          className="transition-bg group block rounded-xl p-3 [corner-shape:squircle] hover:bg-gray-200"
                        >
                          <Picture {...props} alt={alt} className="size-7" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
          <div className="max-w-structure px-content-inline mx-auto">
            <div
              className={clsx(
                isTop && 'max-w-content border-t-secondary mx-auto border-t',
                // Articleページのゲージ分を含む padding-bottom が必要
                'flow-root py-12',
                '@w768:flex @w768:flex-wrap @w768:justify-center @w768:gap-6 @w768:pb-20 @w768:pt-7',
              )}
            >
              <ul className="@w768:flex @w768:grow @w768:flex-wrap @w768:justify-start @w768:gap-y-2 text-xs">
                {FOOTER_LINK_LIST.map(({ href, label, target }, index) => {
                  const className = clsx([
                    "@w768:float-none @w768:p-0 float-left py-1 after:mx-2.5 after:content-['|']",
                    index === FOOTER_LINK_LIST.length - 1 && '@w768:after:hidden',
                  ]);

                  return (
                    <li key={href} className={className}>
                      <Link
                        href={href}
                        className={clsx([
                          'text-inherit [--x-fill:var(--x-color-text-footer)]',
                          isTop ? '@w640:[--x-fill:var(--text-color)]' : 'outline-white!',
                        ])}
                        target={target}
                        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                      >
                        {label[lang]}{' '}
                        {target === '_blank' ? (
                          <span className="mb-1px relative ml-[0.2em] inline-block size-[1em] align-middle">
                            <SvgIcon name="new-tab" alt={OPEN_NEW_TAB[lang]} />
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="-top-1px @w768:float-none @w768:h-auto relative float-left grid h-[1.90625rem] place-items-center text-center text-xs">
                {/* text-[100%] for bootstrap pages */}
                <small className="text-[100%]">&copy; {SITE_NAME}</small>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
