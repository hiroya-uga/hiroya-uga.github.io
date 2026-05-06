'use client';
import { WikiEntry } from '@/libs/wiki';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './WikiBreadcrumb.module.css';

interface Props {
  entries: WikiEntry[];
}

export const WikiBreadcrumb = ({ entries }: Props) => {
  const pathname = usePathname();

  const items: { label: string; href: string }[] = [
    { label: 'HOME', href: '/' },
    { label: 'Wikiʻole', href: '/wiki' },
  ];

  const subSegments = pathname
    .replace(/^\/wiki\/?/, '')
    .split('/')
    .filter(Boolean);

  for (let i = 0; i < subSegments.length; i++) {
    const slug = subSegments.slice(0, i + 1);
    const href = `/wiki/${slug.join('/')}`;
    const entry = entries.find((e) => e.pathname === href);
    items.push({ label: entry?.frontmatter.title ?? subSegments[i], href });
  }

  return (
    <ol className={styles.root}>
      {items.map(({ label, href }, index) => (
        <li key={href} className={styles.item}>
          {index === items.length - 1 ? <a aria-current="page">{label}</a> : <Link href={href}>{label}</Link>}
        </li>
      ))}
    </ol>
  );
};
