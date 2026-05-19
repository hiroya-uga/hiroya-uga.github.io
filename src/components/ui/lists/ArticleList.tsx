'use client';

import { ArticleCard } from '@/components/ui/cards/ArticleCard';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/ssg-articles';
import Link from 'next/link';

type Props = {
  type?: 'simple' | 'thumbnail' | 'og-thumbnail';
  list: ArticleFrontMatter[];
};

export const ArticleList = ({ type = 'simple', list }: Readonly<Props>) => {
  if (type === 'simple') {
    return (
      <ul className="w640:grid w640:gap-4 w640:grid-cols-[auto_1fr] w640:space-y-0 space-y-6">
        {list.map((article) => {
          return (
            <li
              key={article.pathname}
              className="w640:col-span-2 w640:grid w640:grid-cols-subgrid w640:leading-[1.875rem] group"
            >
              <time dateTime={article.publishedAt} className="text-secondary text-sm">
                {formattedDateString(new Date(article.publishedAt))}
              </time>
              <span className="w640:text-lg block w-fit">
                <span className="w640:mb-1 mb-1.5 block">
                  <Link href={article.pathname}>{article.title.replaceAll('\n', '')}</Link>
                </span>
                <span className="text-secondary block text-xs group-last:pb-0">
                  {article.topics?.map?.((tag: string) => `#${tag}`).join(' ')}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="w500:grid-cols-2 w800:grid-cols-3 w1280:grid-cols-4 grid gap-x-4 gap-y-8">
      {list.map((article) => {
        return (
          <li key={article.pathname} className="@container">
            <ArticleCard article={article} type={type} />
          </li>
        );
      })}
    </ul>
  );
};
