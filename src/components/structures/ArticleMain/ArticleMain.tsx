import {
  ArticleCodeHighlightActivator,
  ArticleFootNoteActivator,
  ArticleInformation,
  ArticleYoutubeManager,
} from '@/components/structures/ArticleMain/ArticleMainClient';

import { Heading } from '@/components/Heading';
import styles from '@/components/structures/ArticleMain/ArticleMain.module.css';
import { ARTICLE_MAIN_ID } from '@/constants/id';
import clsx from 'clsx';

type Props = {
  post: {
    meta: {
      [key: string]: any;
      title?: string;
      publishedAt?: string;
    };
    toc: string;
    content: string | Promise<string>;
    footnotes: [string, { html: string | Promise<string> }][];
  };
};

export const ArticleMain = async ({ post }: Props) => {
  const hasTags = Array.isArray(post.meta.tags) && 0 < post.meta.tags.length;

  return (
    <article className={styles.root}>
      <div className={clsx(styles.hero, 'px-content-inline @w1024:pl-10 @w640:mb-14 @w640:mt-8 mb-8 mt-4')}>
        <div
          className={clsx([
            'mx-auto text-center',
            hasTags === true && '@w640:pt-20 pt-12',
            hasTags === false && '@w640:py-20 py-12',
          ])}
        >
          <h1
            className={clsx([
              styles.h1,
              'wrap-anywhere @w640:text-4xl @w800:text-5xl text-2xl',
              post.meta.title?.endsWith('。') && '@w800:pl-[0.5em]',
            ])}
          >
            {post.meta.title?.split('\n').map((title, index) => {
              const key = `${title}-${index}`;

              return (
                <span key={key} className="@w400:inline-block">
                  {/* {title.split('`').map((part, partIndex) => {
                      if (part === '') {
                        return null;
                      }

                      if (partIndex % 2 === 0) {
                        return <span key={partIndex}>{part}</span>;
                      }
                      return <code key={partIndex}>{part}</code>;
                    })}
                     */}
                  {title}
                </span>
              );
            })}
          </h1>
          <ArticleInformation date={post.meta.publishedAt} />
        </div>
        {hasTags && (
          <div className="@w640:mt-13.5 mt-5 flex flex-wrap justify-end pb-1 text-right text-xs">
            {/* <p>この記事のテーマ：</p> */}
            <ul className="text-secondary flex flex-wrap justify-end gap-2">
              {post.meta.tags.map((tag: string) => (
                <li key={tag}>
                  <span>#{tag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="px-content-inline @w1024:pl-10">
        <div
          className={clsx([
            'max-w-article @w1280:max-w-none mx-auto',
            '@w1280:grid @w1280:grid-cols-[1fr_var(--width-article)_1fr] @w1280:grid-rows-[auto_auto]',
          ])}
        >
          {post.toc && (
            <div
              className={clsx([
                styles.toc,
                '@w1280:col-start-3 @w1280:row-start-1 @w1280:row-end-3 @w1280:pl-14 @w640:mb-14 mb-8',
              ])}
            >
              <nav
                className={clsx([
                  'border-accent bg-secondary rounded-r-md border-l-2 pb-7 pl-5 pr-4 pt-4 text-sm',
                  '@w1280:sticky @w1280:top-18',
                ])}
              >
                <h2 className="font-bold">目次</h2>
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: post.toc }} />
              </nav>
            </div>
          )}
          <div
            id={ARTICLE_MAIN_ID}
            className={clsx(
              styles.article,
              'space-y-paragraph',
              '@w1280:col-start-2 @w1280:col-end-3 @w1280:row-start-1 @w1280:row-end-2',
            )}
            dangerouslySetInnerHTML={{ __html: await post.content }}
          />
          <ArticleFootNoteActivator />
          <ArticleCodeHighlightActivator />
          <ArticleYoutubeManager />
          <div role="note" className="@w1280:col-start-2 @w1280:col-end-3 @w1280:row-start-2 empty:hidden">
            {0 < post.footnotes.length && (
              <>
                <Heading level={2} id="footnotes" keepUseMarginTop>
                  脚注
                </Heading>
                <ul className="grid grid-cols-[auto_1fr] gap-x-1 text-sm">
                  {post.footnotes.map(async ([id, { html }]) => (
                    <li key={id} id={`note-${id}`} className="col-start-1 col-end-3 grid grid-cols-subgrid">
                      <span className="whitespace-nowrap font-mono">
                        <a href={`#ref-${id}`} title={`本文の[^${id}]へ戻る`}>{`[^${id}]`}</a>:
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: await html }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
