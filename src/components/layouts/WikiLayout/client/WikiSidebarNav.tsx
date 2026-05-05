'use client';

import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { SITE_NAME } from '@/constants/meta';
import { WikiEntry } from '@/libs/wiki';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId } from 'react';
import styles from './WikiSidebarNav.module.css';

interface Props {
  entries: WikiEntry[];
}

export const WikiSidebarNav = ({ entries }: Props) => {
  const pathname = usePathname();
  const id = useId();

  const currentSlug = pathname
    .replace(/^\/wiki\/?/, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);
  const siblingEntries = entries.filter(({ slug }) => {
    if (slug.length !== currentSlug.length) return false;
    return currentSlug.slice(0, -1).every((seg, i) => seg === slug[i]);
  });
  const childEntries = entries.filter(({ slug }) => {
    if (slug.length !== currentSlug.length + 1) return false;
    return currentSlug.every((seg, i) => seg === slug[i]);
  });
  const parentEntry =
    currentSlug.length > 0
      ? (entries.find(({ slug }) => {
          if (slug.length !== currentSlug.length - 1) return false;
          return currentSlug.slice(0, -1).every((seg, i) => seg === slug[i]);
        }) ?? { pathname: '/wiki', frontmatter: { title: 'Wikiʻoleトップ' } })
      : undefined;

  return (
    <div className={styles.root}>
      <p className={styles.top}>
        <Link href="/">{SITE_NAME}</Link>
      </p>
      <form
        role="search"
        action="https://www.google.com/search"
        className={styles.search}
        onSubmit={(e) => {
          const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement;
          input.value = `site:uga.dev ${input.value}`;
        }}
      >
        <p>
          <label htmlFor={id} className={styles.label}>
            サイト内検索
          </label>
          <span className={styles.field}>
            <input type="search" id={id} name="q" placeholder="ここにキーワードを入力" />
            <button type="submit">検索</button>
          </span>
        </p>
      </form>

      <div className={styles.menu}>
        {0 < childEntries.length && (
          <>
            <p className={styles.heading}>
              {parentEntry === undefined ? (
                'カテゴリー'
              ) : (
                <Link href={parentEntry.pathname}>{parentEntry.frontmatter.title}</Link>
              )}
            </p>
            <ul className={styles.list}>
              {childEntries.map(({ pathname: entryPathname, frontmatter }) => (
                <li key={entryPathname}>
                  <Link href={entryPathname}>{frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {0 < siblingEntries.length && (
          <>
            <p className={styles.heading}>関連ﾍﾟｰｼﾞ</p>
            <ul className={styles.list}>
              {siblingEntries.map(({ pathname: entryPathname, frontmatter }) => (
                <li key={entryPathname}>
                  {pathname.replace(/\/$/, '') === entryPathname ? (
                    <a aria-current="page">{frontmatter.title}</a>
                  ) : (
                    <Link href={entryPathname}>{frontmatter.title}</Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <p className={styles.heading}>ご案内</p>
        <ul className={styles.list}>
          {FOOTER_LINK_LIST.map(({ href, label, target }) => (
            <li key={href}>
              {target === '_blank' ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label.ja}
                  <img
                    src="/common/images/icons/new-window.svg"
                    alt="新しいタブで開く"
                    className={styles.newWindowIcon}
                  />
                </a>
              ) : (
                <Link href={href} aria-current={pathname === href ? 'page' : undefined}>
                  {label.ja}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
