'use client';

import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { SITE_NAME } from '@/constants/meta';
import { NotesEntry } from '@/libs/notes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId } from 'react';
import styles from './NotesSidebarNav.module.css';

interface Props {
  entries: NotesEntry[];
}

const META_SLUGS = ['help'];

const compareEntries = (a: NotesEntry, b: NotesEntry) => {
  const aMeta = a.slug.length > 0 && META_SLUGS.includes(a.slug[0]);
  const bMeta = b.slug.length > 0 && META_SLUGS.includes(b.slug[0]);
  if (aMeta !== bMeta) return aMeta ? 1 : -1;
  return a.frontmatter.title.localeCompare(b.frontmatter.title, 'ja');
};

export const NotesSidebarNav = ({ entries }: Props) => {
  const pathname = usePathname();
  const id = useId();

  const currentSlug = pathname
    .replace(/^\/notes\/?/, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);
  const siblingEntries = entries
    .filter(({ slug }) => {
      if (slug.length !== currentSlug.length) return false;
      return currentSlug.slice(0, -1).every((seg, i) => seg === slug[i]);
    })
    .sort(compareEntries);
  const childEntries = entries
    .filter(({ slug }) => {
      if (slug.length !== currentSlug.length + 1) return false;
      return currentSlug.every((seg, i) => seg === slug[i]);
    })
    .sort(compareEntries);
  const parentEntry =
    currentSlug.length > 0
      ? (entries.find(({ slug }) => {
          if (slug.length !== currentSlug.length - 1) return false;
          return currentSlug.slice(0, -1).every((seg, i) => seg === slug[i]);
        }) ?? { pathname: '/notes', frontmatter: { title: 'Wikiʻoleトップ' } })
      : undefined;

  const currentEntry = entries.find(
    ({ slug }) => slug.length === currentSlug.length && currentSlug.every((seg, i) => seg === slug[i]),
  );

  const showNavMenu = childEntries.length > 0 || siblingEntries.length > 0;

  const navListItems = (() => {
    if (childEntries.length > 0) {
      // 子ページあり: 現在ページを起点にネスト（兄弟はひったん非表示）
      if (currentEntry) {
        return (
          <li>
            <span className={styles.text}>
              <a aria-current="page">{currentEntry.frontmatter.title}</a>
            </span>
            <ul>
              {childEntries.map(({ pathname: entryPathname, frontmatter }) => (
                <li key={entryPathname}>
                  <Link href={entryPathname}>{frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </li>
        );
      }

      return childEntries.map(({ pathname: entryPathname, frontmatter }) => (
        <li key={entryPathname}>
          <Link href={entryPathname}>{frontmatter.title}</Link>
        </li>
      ));
    }

    // 子ページなし: 兄弟を表示（ここでしか親への動線がない）
    return siblingEntries.map(({ pathname: entryPathname, frontmatter }) => (
      <li key={entryPathname}>
        {pathname.replace(/\/$/, '') === entryPathname ? (
          <span className={styles.text}>
            <a aria-current="page">{frontmatter.title}</a>
          </span>
        ) : (
          <Link href={entryPathname}>{frontmatter.title}</Link>
        )}
      </li>
    ));
  })();

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
        {showNavMenu && (
          <>
            <p className={styles.heading}>
              {parentEntry === undefined ? (
                'カテゴリー'
              ) : (
                <Link href={parentEntry.pathname}>{parentEntry.frontmatter.title}</Link>
              )}
            </p>
            <ul className={styles.list}>{navListItems}</ul>
          </>
        )}

        <p className={styles.heading}>ご案内</p>
        <ul className={styles.list}>
          {FOOTER_LINK_LIST.map(({ href, label, target }) => (
            <li key={href}>
              {target === '_blank' ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label.ja}
                  <span className={styles.newWindowIcon}>
                    <SvgIcon name="new-tab" alt="新しいタブで開く" />
                  </span>
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
