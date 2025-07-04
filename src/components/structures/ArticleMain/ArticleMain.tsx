import { ArticleInformation } from '@/components/structures/ArticleMain/ArticleMainClient';

import styles from '@/components/structures/ArticleMain/ArticleMain.module.css';
import clsx from 'clsx';

type Props = {
  post: {
    meta: {
      [key: string]: any;
      title?: string;
      publishedAt?: string;
    };
    content: string | Promise<string>;
  };
};

export const ArticleMain = async ({ post }: Props) => {
  const hasTags = Array.isArray(post.meta.tags) && 0 < post.meta.tags.length;

  return (
    <article className={clsx([styles.root, '@container'])}>
      <div className={clsx(styles.h1, 'px-content-inline @w1024:pl-10 @w640:mb-14 @w640:mt-8 mb-8 mt-4')}>
        <div
          className={clsx([
            'max-w-content mx-auto text-center',
            hasTags === true && '@w640:pt-20 pt-12',
            hasTags === false && '@w640:py-20 py-12',
          ])}
        >
          <h1 className="@w640:text-5xl text-2xl">
            {post.meta.title?.split('\n').map((title, index) => {
              return (
                <span key={index} className="last:inline-block">
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
          className="space-y-paragraph max-w-article mx-auto"
          dangerouslySetInnerHTML={{ __html: await post.content }}
        />
      </div>
    </article>
  );
};
