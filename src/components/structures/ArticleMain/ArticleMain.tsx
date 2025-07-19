import {
  ArticleCodeHighlightActivator,
  ArticleFootNoteActivator,
  ArticleInformation,
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
    content: string | Promise<string>;
    footnotes: [string, { html: string | Promise<string> }][];
  };
};

export const ArticleMain = async ({ post }: Props) => {
  const hasTags = Array.isArray(post.meta.tags) && 0 < post.meta.tags.length;

  return (
    <>
      <article className={styles.root}>
        <div className={clsx(styles.h1, 'px-content-inline @w1024:pl-10 @w640:mb-14 @w640:mt-8 mb-8 mt-4')}>
          <div
            className={clsx([
              'mx-auto text-center',
              hasTags === true && '@w640:pt-20 pt-12',
              hasTags === false && '@w640:py-20 py-12',
            ])}
          >
            <h1 className="@w640:text-4xl @w800:text-5xl text-2xl">
              <span className="sr-only">{post.meta.title?.replaceAll('\n', '')}</span>
              <span aria-hidden="true">
                {post.meta.title?.split('\n').map((title, index) => {
                  return (
                    <span key={index} className="@w400:inline-block">
                      {title}
                    </span>
                  );
                })}
              </span>
            </h1>
            <ArticleInformation date={post.meta.publishedAt} />
          </div>
          {hasTags && (
            <div className="@w640:mt-13.5 mt-5 flex flex-wrap justify-end pb-1 text-right text-xs">
              {/* <p>この記事のテーマ：</p> */}
              <ul className="text-description flex flex-wrap justify-end gap-2">
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
            id={ARTICLE_MAIN_ID}
            className={clsx(styles.article, 'space-y-paragraph max-w-article mx-auto')}
            dangerouslySetInnerHTML={{ __html: await post.content }}
          />
          <div role="note" className="max-w-article mx-auto mt-20 empty:hidden">
            {0 < post.footnotes.length && (
              <>
                <Heading level={2}>脚注</Heading>
                <ul className="grid grid-cols-[auto_1fr] gap-x-1 text-sm">
                  {post.footnotes.map(async ([id, { html }]) => (
                    <li key={id} id={`note-${id}`} className="col-start-1 col-end-3 grid grid-cols-subgrid">
                      <span className="font-mono">
                        <a href={`#ref-${id}`}>{`[${id}^]`}</a>:
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: await html }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </article>
      <ArticleFootNoteActivator />
      <ArticleCodeHighlightActivator />
    </>
  );
};
