import { BREADCRUMB_LABEL } from '@/constants/messages';
import { SITE_NAME } from '@/constants/meta';
import { WikiEntry } from '@/libs/wiki';
import { DotGothic16 } from 'next/font/google';
import Link from 'next/link';
import { WikiBreadcrumb } from './client/WikiBreadcrumb';
import { WikiSidebarNav } from './client/WikiSidebarNav';
import { WikiThemeToggle } from './client/WikiThemeToggle';
import styles from './WikiLayout.module.css';

const dotGothic16 = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dot-gothic',
  preload: false,
});

interface Props {
  entries: WikiEntry[];
  children: React.ReactNode;
}

export const WikiLayout = ({ entries, children }: Readonly<Props>) => {
  return (
    <div className={`${styles.container} ${dotGothic16.variable}`}>
      <div className={styles.root}>
        <header className={styles.header}>
          <p className={styles.siteName}>
            <Link href="/wiki">WikiʻoleWeb</Link>
          </p>
          <ul className={styles.utility}>
            <li>
              <Link href="../" className={styles.return} aria-label="１つ上のページへ戻る">
                <span>１つ上のページへ戻る</span>
              </Link>
            </li>
            <li>
              <Link href="/wiki/help">
                <span>ご利用にあたって</span>
              </Link>
            </li>
            <li>
              <WikiThemeToggle />
            </li>
          </ul>
        </header>
        <nav className={`${styles.navigation} ${styles.ofWide}`} aria-label="Wiki ナビゲーション">
          <WikiSidebarNav entries={entries} />
        </nav>
        <div className={styles.content}>{children}</div>
        <nav className={`${styles.navigation} ${styles.ofNarrow}`} aria-label="Wiki ナビゲーション">
          <WikiSidebarNav entries={entries} />
        </nav>
        <nav className={styles.breadcrumb} aria-label={BREADCRUMB_LABEL.ja}>
          <WikiBreadcrumb entries={entries} />
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
