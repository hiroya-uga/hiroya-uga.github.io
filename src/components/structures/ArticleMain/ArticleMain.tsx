import { ArticleInformation } from '@/components/structures/ArticleMain/ArticleMainClient';

import styles from '@/components/structures/ArticleMain/ArticleMain.module.css';
import clsx from 'clsx';

type Props = {
  post: {
    meta: {
      [key: string]: any;
    };
    content: string | Promise<string>;
  };
};

export const ArticleMain = async ({ post }: Props) => {
  return (
    <article className="@container">
      <div
        className={clsx(styles.h1, 'px-content-inline @w1024:pl-10 @w640:py-20 @w640:mb-14 @w640:mt-8 mb-8 mt-4 py-12')}
      >
        <div className="max-w-content mx-auto text-center">
          <h1 className="@w640:text-5xl text-2xl">{post.meta.title}</h1>
          <ArticleInformation date={post.meta.publishedAt} />
        </div>
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
