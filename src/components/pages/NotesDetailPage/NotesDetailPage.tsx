import { ArticleCodeHighlightActivator } from '@/components/structures/ArticleMain/ArticleMainClient';
import { NOTES_NAVIGATION_ID, TOC_ID } from '@/constants/id';
import '@/libs/marked';
import { NotesEntry, NotesFrontmatter } from '@/libs/notes';
import { marked } from 'marked';
import Link from 'next/link';
import { useId } from 'react';
import { NotesGitHubEditLink } from './client';
import styles from './NotesDetailPage.module.css';

interface Props {
  frontmatter?: NotesFrontmatter;
  content?: string;
  toc?: string;
  childEntries?: NotesEntry[];
}

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const NotesDetailPage = ({ frontmatter, content, toc, childEntries }: Props) => {
  const id = useId();

  const publishedDate = frontmatter ? dateFormatter.format(new Date(frontmatter.publishedAt)) : '';
  const updatedDate =
    frontmatter?.updatedAt !== undefined ? dateFormatter.format(new Date(frontmatter.updatedAt)) : undefined;

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>
        <span className={styles.text}>{frontmatter?.title}</span>
      </h1>

      <div className={styles.meta}>
        {frontmatter !== undefined && (
          <>
            <div className={styles.date}>
              <p>
                公開日：
                <time dateTime={frontmatter.publishedAt}>{publishedDate}</time>
              </p>
              {updatedDate !== undefined && updatedDate !== publishedDate && (
                <p>
                  最終更新：
                  <time dateTime={frontmatter.updatedAt}>{updatedDate}</time>
                </p>
              )}
            </div>
            {frontmatter.description !== '' && (
              <p
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: marked.parseInline(frontmatter.description, { async: false }) as string,
                }}
              />
            )}
          </>
        )}

        <p className={styles.toMenu}>
          <a href={`#${NOTES_NAVIGATION_ID}`}>メニュー</a>
        </p>
      </div>

      {toc !== undefined && toc !== '' && (
        <nav id={TOC_ID} aria-labelledby={id} className={styles.toc}>
          <div className={styles.inner}>
            <h2 id={id}>目次</h2>
            <div className={styles.list} dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        </nav>
      )}
      <article className={styles.body} aria-label="本文">
        <div className={styles.content}>
          {content !== undefined && content !== '' && <div dangerouslySetInnerHTML={{ __html: content }} />}

          {childEntries && 0 < childEntries.length && (
            <>
              <ul className={styles.children}>
                {childEntries.map((entry) => (
                  <li key={entry.pathname}>
                    <Link href={`${entry.pathname}/`}>{entry.frontmatter.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <footer className={styles.edit}>
          <NotesGitHubEditLink />
        </footer>
      </article>
      <ArticleCodeHighlightActivator />
    </main>
  );
};
