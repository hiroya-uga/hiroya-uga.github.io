import { BREADCRUMB_LABEL } from '@/constants/messages';
import { SITE_NAME } from '@/constants/meta';
import { NotesEntry } from '@/libs/notes';
import clsx from 'clsx';
import { DotGothic16 } from 'next/font/google';
import Link from 'next/link';
import { NotesBreadcrumb } from './client/NotesBreadcrumb';
import { NotesSidebarNav } from './client/NotesSidebarNav';
import { NotesThemeToggle } from './client/NotesThemeToggle';
import styles from './NotesLayout.module.css';

const dotGothic16 = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dot-gothic',
  preload: false,
});

interface Props {
  entries: NotesEntry[];
  children: React.ReactNode;
}

export const NotesLayout = ({ entries, children }: Readonly<Props>) => {
  return (
    <div className={`${styles.container} ${dotGothic16.variable}`}>
      <div className={styles.root}>
        <header className={styles.header}>
          <p className={styles.siteName}>
            <Link href="/notes">WikiʻoleWeb</Link>
          </p>
          <ul className={styles.utility}>
            <li>
              <Link href="../" className={styles.return} aria-label="１つ上のページへ戻る">
                <span>１つ上のページへ戻る</span>
              </Link>
            </li>
            <li>
              <Link href="/notes/help">
                <span>ご利用にあたって</span>
              </Link>
            </li>
            <li>
              <NotesThemeToggle />
            </li>
          </ul>
        </header>
        <nav className={clsx([styles.navigation, styles.ofWide])} aria-label="Notes ナビゲーション">
          <NotesSidebarNav entries={entries} />
        </nav>
        <div className={styles.content}>
          <nav className={styles.breadcrumb} aria-label={BREADCRUMB_LABEL.ja}>
            <NotesBreadcrumb entries={entries} />
          </nav>
          {children}
        </div>
        <nav className={clsx([styles.navigation, styles.ofNarrow])} aria-label="Notes ナビゲーション">
          <NotesSidebarNav entries={entries} />
        </nav>
        <footer className={styles.footer}>
          <p>
            <small>
              &copy;{new Date().getFullYear()} {SITE_NAME}
              <span className={styles.allRightsReserved}>. All rights reserved.</span>
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};
