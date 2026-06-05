'use client';

import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
import type { NotesEntry } from '@/libs/notes';
import { compareNotesEntries } from '@/libs/notes/compare';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import styles from './NotesSidebarNav.module.css';

interface Props {
  entries: NotesEntry[];
}

export const NotesSidebarNav = ({ entries }: Props) => {
  const pathname = usePathname();
  const id = useId();
  const [keyword, setKeyword] = useState('');

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
      .sort(compareNotesEntries);

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

  const onSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form =
      document.querySelector<HTMLFormElement>('form[action="https://www.google.com/search"]') ??
      document.createElement('form');
    form.replaceChildren();
    form.action = 'https://www.google.com/search';
    form.method = 'get';
    const input = document.createElement('input');
    input.name = 'q';
    input.value = `site:uga.dev/notes/ ${keyword}`;
    form.append(input);
    document.body.append(form);
    form.submit();
  };

  return (
    <div className={styles.root}>
      <p className={styles.top}>
        <Link href="/notes">WikiʻoleWeb</Link>
      </p>
      <form role="search" className={styles.search} onSubmit={onSubmit}>
        <p>
          <label htmlFor={id} className={styles.label}>
            サイト内検索
          </label>
          <span className={styles.field}>
            <input
              type="search"
              id={id}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ここにキーワードを入力"
              required
            />
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
