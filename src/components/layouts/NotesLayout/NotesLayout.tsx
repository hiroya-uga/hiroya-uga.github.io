import { SvgIcon } from '@/components/ui/media/SvgIcon';
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
          <aside className={styles.ad}>
            <p>
              <Link href="/tools/vnux">
                <span className={styles.adBadge}>
                  <span className={styles.adLabel}>
                    <span className="relative block size-[1lh]">
                      <SvgIcon name="information" alt="" />
                    </span>
                    <span className={styles.adText}>AI生成画像</span>
                  </span>
                </span>
                <picture>
                  <source
                    media="(width <= 20.38rem)"
                    srcSet="/notes/images/gemini-generated-vnux-240x60.webp"
                    width={120}
                    height={30}
                  />
                  <source
                    media="(20.38rem < width < 40rem)"
                    srcSet="/notes/images/gemini-generated-vnux-504x84.webp"
                    width={168 * 1.5}
                    height={28 * 1.5}
                  />
                  <img
                    src="/notes/images/gemini-generated-vnux-1404x180.webp"
                    width={468 * 1.5}
                    height={60 * 1.5}
                    alt="vnux: Nu Html Checker for macOS"
                  />
                </picture>
              </Link>
            </p>
          </aside>

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
              &copy;<span className={styles.year}>{new Date().getFullYear()}</span> {SITE_NAME}
              <span className={styles.allRightsReserved}>. All rights reserved.</span>
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};
