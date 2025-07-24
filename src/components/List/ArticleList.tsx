'use client';

import { LoadingIcon } from '@/components/Icons';
import { Picture } from '@/components/Image';
import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';
import { resolveCategoryName } from '@/utils/articles';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/ssg-articles';
import Link from 'next/link';
import { useId } from 'react';

type Props = {
  type?: 'simple' | 'thumbnail';
  list: ArticleFrontMatter[];
};

export const ArticleList = ({ type = 'simple', list }: Props) => {
  const untilFound = useHiddenUntilFound();
  const prefix = useId();

  if (type === 'simple') {
    return (
      <div className="@container">
        <ul className="@w640:table space-y-3">
          {list.map((article) => {
            return (
              <li key={article.pathname} className="@w640:table-row leading-36px gap-2">
                <time
                  dateTime={article.publishedAt}
                  className="text-secondary @w640:pr-4 @w640:table-cell pr-3 text-sm"
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
          const titleId = `${prefix}-${article.pathname}-title`;
          const infoId = `${prefix}-${article.pathname}-info`;

          return (
            <li key={article.pathname} className="grid gap-2">
              <Link
                href={article.pathname}
                className="bg-secondary group grid grid-rows-[auto_1fr] rounded-md pb-2 no-underline [box-shadow:_0_0_2px_1px_rgba(0,_0,_0,_0.1)]"
                aria-labelledby={`${titleId} ${infoId}`}
              >
                <div className="relative z-0 overflow-hidden">
                  <Picture
                    src={`/generated-ogp${article.pathname}.png`}
                    alt=""
                    width={1200}
                    height={630}
                    className="mb-2 block rounded-t-md transition-[opacity,scale] group-hover:scale-105"
                    priority
                  />
                  <span className="starting:opacity-0 delay-600 absolute inset-0 -z-10 m-auto grid place-items-center transition-opacity">
                    <LoadingIcon alt="" />
                  </span>
                </div>

                <div className="grid grid-rows-[1fr_auto]">
                  <div className="px-3 group-hover:underline" {...untilFound}>
                    <div className="pb-1" id={titleId}>
                      {article.title.replaceAll('\n', '')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-3 pr-2" id={infoId}>
                    <time dateTime={article.publishedAt} className="text-primary @w640:mr-0 mr-3 text-sm">
                      {formattedDateString(new Date(article.publishedAt))}
                    </time>
                    <div className="text-primary pt-1.25 ml-2 inline-block content-center border border-solid p-1 text-center text-sm leading-none">
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
