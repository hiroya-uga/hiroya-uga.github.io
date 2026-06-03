import {
  ArticleCodeHighlightActivator,
  ArticleFootNoteActivator,
  ArticleSpeculationRulesActivator,
} from '@/components/structures/ArticleMain/ArticleMainClient';
import { FOOTNOTES_HEADING_ID, NOTES_NAVIGATION_ID, TOC_ID } from '@/constants/id';
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
  footnotes?: [string, { html: string | Promise<string> }][];
}

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getSpeculationRules = (selector: string) =>
  JSON.stringify({
    prerender: [
      {
        where: {
          and: [{ selector_matches: `.${selector} a[href^='/']` }, { not: { selector_matches: '[rel~=nofollow]' } }],
        },
        eagerness: 'immediate',
      },
    ],
  });

export const NotesDetailPage = ({ frontmatter, content, toc, childEntries, footnotes = [] }: Props) => {
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

          {0 < footnotes.length && (
            <section role="note" aria-labelledby={FOOTNOTES_HEADING_ID}>
              <h2 id={FOOTNOTES_HEADING_ID}>出典</h2>
              <ul className="grid grid-cols-[auto_1fr] gap-x-1 gap-y-2">
                {footnotes.map(async ([id, { html }]) => (
                  <li key={id} id={`note-${id}`} className="col-start-1 col-end-3 grid grid-cols-subgrid">
                    <span className="whitespace-nowrap font-mono">
                      <a href={`#ref-${id}`} title={`本文の[^${id}]へ戻る`}>{`[^${id}]`}</a>:
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: await html }} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <footer className={styles.edit}>
          <NotesGitHubEditLink />
        </footer>
      </article>
      <ArticleCodeHighlightActivator />
      <ArticleFootNoteActivator />
      <ArticleSpeculationRulesActivator rules={getSpeculationRules(styles.content)} />
    </main>
  );
};
