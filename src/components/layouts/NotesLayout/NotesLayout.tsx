import { NotesNavigation } from '@/components/domains/notes/NotesNavigation';
import { NotesSearch } from '@/components/layouts/NotesLayout/client/NotesSearch';
import { ThemeSwitch } from '@/components/structures/ThemeSwitch';
import { NOTES_NAVIGATION_ID } from '@/constants/id';
import { BREADCRUMB_LABEL } from '@/constants/messages';
import { SITE_NAME } from '@/constants/meta';
import { NotesEntry } from '@/libs/notes';
import clsx from 'clsx';
import { DotGothic16 } from 'next/font/google';
import Link from 'next/link';
import { NotesBreadcrumb } from './client/NotesBreadcrumb';
import { NotesThemeToggle } from './client/NotesThemeToggle';
import { NotesAd } from './NotesAd';
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
    <div className={dotGothic16.variable}>
      <div className={styles.root}>
        <header className={styles.header}>
          <p className={styles.siteName}>
            <Link href="/">{SITE_NAME}</Link>
          </p>
          <ul className={styles.utility}>
            <li>
              <Link href="../" className={styles.return} aria-label="１つ上のページへ戻る">
                <span>１つ上のページへ戻る</span>
              </Link>
            </li>
            <li>
              <Link href="/notes/#heading-ご利用にあたって">
                <span>ご利用にあたって</span>
              </Link>
            </li>
            <li>
              <NotesThemeToggle />
            </li>
            <li>
              <ThemeSwitch />
            </li>
          </ul>
        </header>

        <div className={clsx([styles.navigation, styles.ofWide])}>
          <NotesNavigation entries={entries} />
        </div>

        <div className={styles.content}>
          <nav className={styles.breadcrumb} aria-label={BREADCRUMB_LABEL.ja}>
            <NotesBreadcrumb entries={entries} />
          </nav>

          <div className={styles.search}>
            <NotesSearch />
          </div>

          <aside className={styles.ad}>
            <NotesAd />
          </aside>

          {children}
        </div>

        <div className={clsx([styles.navigation, styles.ofNarrow])}>
          <NotesNavigation id={NOTES_NAVIGATION_ID} entries={entries} />
        </div>

        <footer className={styles.footer}>
          <p>
            <small>
              &copy;<span className={styles.year}>{new Date().getFullYear()}</span> {SITE_NAME}
              <span className={styles.allRightsReserved}>. All rights reserved.</span>
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};
