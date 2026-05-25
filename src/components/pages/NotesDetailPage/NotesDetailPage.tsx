import { ArticleCodeHighlightActivator } from '@/components/structures/ArticleMain/ArticleMainClient';
import '@/libs/marked';
import { NotesEntry, NotesFrontmatter } from '@/libs/notes';
import { marked } from 'marked';
import Link from 'next/link';
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
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>
        <span className={styles.text}>{frontmatter?.title}</span>
      </h1>

      {frontmatter !== undefined && (
        <div className={styles.meta}>
          <div className={styles.date}>
            <p>
              公開日：
              <time dateTime={frontmatter.publishedAt}>{dateFormatter.format(new Date(frontmatter.publishedAt))}</time>
            </p>
            {frontmatter.updatedAt !== undefined && frontmatter.updatedAt !== frontmatter.publishedAt && (
              <p>
                最終更新：
                <time dateTime={frontmatter.updatedAt}>{dateFormatter.format(new Date(frontmatter.updatedAt))}</time>
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
        </div>
      )}

      {toc !== undefined && toc !== '' && (
        <nav aria-label="目次" className={styles.toc}>
          <div className={styles.inner}>
            <h2>目次</h2>
            <div className={styles.list} dangerouslySetInnerHTML={{ __html: toc }} />
          </div>
        </nav>
      )}
      <div className={styles.body}>
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

        <div className={styles.edit}>
          <NotesGitHubEditLink />
        </div>
      </div>
      <ArticleCodeHighlightActivator />
    </main>
  );
};
