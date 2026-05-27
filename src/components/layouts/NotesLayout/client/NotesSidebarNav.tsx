'use client';

import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
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

  const isCurrentPath = (entryPathname: string) => pathname.replace(/\/$/, '') === entryPathname;
  const isAncestorOfCurrent = (slug: string[]) =>
    slug.length <= currentSlug.length && slug.every((seg, i) => seg === currentSlug[i]);

  const getChildren = (parentSlug: string[]) =>
    entries
      .filter(({ slug }) => slug.length === parentSlug.length + 1 && parentSlug.every((seg, i) => seg === slug[i]))
      .sort(compareEntries);

  const renderTree = (parentSlug: string[], className?: string) => {
    const children = getChildren(parentSlug);
    if (children.length === 0) return null;

    return (
      <ul className={className}>
        {children.map(({ pathname: entryPathname, frontmatter, slug }) => {
          const isCurrent = isCurrentPath(entryPathname);
          return (
            <li key={entryPathname}>
              <span className={styles.text}>
                {isCurrent ? (
                  <a aria-current="page">{frontmatter.title}</a>
                ) : (
                  <Link href={entryPathname}>{frontmatter.title}</Link>
                )}
              </span>
              {isAncestorOfCurrent(slug) && renderTree(slug)}
            </li>
          );
        })}
      </ul>
    );
  };

  const topLevelChildren = getChildren([]);
  const showNavMenu = topLevelChildren.length > 0;

  return (
    <div className={styles.root}>
      <p className={styles.top}>
        <Link href="/notes">WikiʻoleWeb</Link>
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
              <Link href="/notes">Wikiʻoleトップ</Link>
            </p>
            {renderTree([], styles.list)}
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
