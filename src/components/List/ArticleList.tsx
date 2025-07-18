'use client';

import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';
import { resolveCategoryName } from '@/utils/articles';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/ssg-articles';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  type?: 'simple' | 'thumbnail';
  list: ArticleFrontMatter[];
};

export const ArticleList = ({ type = 'simple', list }: Props) => {
  const untilFound = useHiddenUntilFound();

  if (type === 'simple') {
    return (
      <div className="@container">
        <ul className="@w640:table space-y-3">
          {list.map((article) => {
            return (
              <li key={article.pathname} className="@w640:table-row leading-36px gap-2">
                <time
                  dateTime={article.publishedAt}
                  className="text-description @w640:pr-4 @w640:table-cell pr-3 text-sm"
                >
                  {formattedDateString(new Date(article.publishedAt))}
                </time>
                {/* <span className="@w640:table-cell @w640:px-4 text-center text-sm">
                  {resolveCategoryName(article.pathname.split('/')[2])}
                </span> */}
                <span className="@w640:text-lg @w640:table-cell block w-fit">
                  <Link href={article.pathname}>{article.title.replaceAll('\n', '')}</Link>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="@container">
      <ul className="@w400:grid-cols-2 @w800:grid-cols-3 grid gap-4">
        {list.map((article) => {
          return (
            <li key={article.pathname} className="grid gap-2">
              <Link
                href={article.pathname}
                className="bg-banner group grid grid-rows-[auto_1fr] rounded-md pb-2 no-underline [box-shadow:_0_0_2px_1px_rgba(0,_0,_0,_0.1)]"
              >
                <div className="overflow-hidden">
                  <Image
                    src={`/generated-ogp${article.pathname}.png`}
                    alt={article.title.replaceAll('\n', '')}
                    width={1200}
                    height={630}
                    className="mb-2 block rounded-t-md transition-[scale] group-hover:scale-105"
                  />
                </div>

                <div className="grid grid-rows-[1fr_auto]">
                  <div className="px-3 group-hover:underline" {...untilFound}>
                    <div className="pb-1">{article.title.replaceAll('\n', '')}</div>
                  </div>

                  <div className="flex items-center justify-between pl-3 pr-2">
                    <time dateTime={article.publishedAt} className="text-text @w640:mr-0 mr-3 text-sm">
                      {formattedDateString(new Date(article.publishedAt))}
                    </time>
                    <div className="text-text pt-1.25 ml-2 inline-block content-center border border-solid p-1 text-center text-sm leading-none">
                      {resolveCategoryName(article.pathname.split('/')[2])}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
