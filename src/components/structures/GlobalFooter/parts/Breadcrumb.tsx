'use client';

import { Fragment } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SEO } from '@/constants/seo';
import { getAncestorPaths } from '@/utils/breadcrumb';

import styles from './Breadcrumb.module.css';

type Props = {
  label: string;
  additionalBreadcrumbs?: { title: string; href: string }[];
  currentPageTitle?: string;
};

const ListItems = ({ additionalBreadcrumbs, currentPageTitle }: Omit<Props, 'label'>) => {
  const pathname = usePathname() ?? '';
  const pathnames = getAncestorPaths(pathname);
  const isOnEnPage = pathname.endsWith('/en/');

  // 英語ページから日本語コンテンツへ遷移するリンクには (JP) を付ける
  const labelForAncestor = (path: string) => {
    const title = SEO[path].title;
    const isJaTarget = path.endsWith('/en') === false;
    return isOnEnPage && isJaTarget ? `${title} (JP)` : title;
  };

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
                {labelForAncestor(path)}
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

export const Breadcrumb = ({ label, additionalBreadcrumbs, currentPageTitle }: Props) => {
  return (
    <nav className={clsx(['pwa:hidden mt-[20vh]', styles.root])} aria-label={label}>
      <div className="max-w-structure px-content-inline w1024:pl-(--x-spacing-content-inline) bg-(--x-color-background-breadcrumb) w1024:bg-transparent w1024:py-5 w1024:pr-[calc(13.5rem+calc(var(--x-spacing-content-inline)*2))] mx-auto py-4 text-sm">
        <ol className="flex flex-wrap gap-y-0.5 leading-normal">
          <ListItems additionalBreadcrumbs={additionalBreadcrumbs} currentPageTitle={currentPageTitle} />
        </ol>
      </div>
    </nav>
  );
};
