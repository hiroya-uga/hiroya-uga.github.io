'use client';

import { LoadingIcon } from '@/components/Icons';
import { Picture } from '@/components/Image';
import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';
import { resolveArticleImagePath, resolveCategoryName } from '@/utils/articles';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/ssg-articles';
import Link from 'next/link';
import { useId } from 'react';

type Props = {
  type?: 'simple' | 'thumbnail' | 'og-thumbnail';
  list: ArticleFrontMatter[];
};

export const ArticleList = ({ type = 'simple', list }: Props) => {
  const untilFound = useHiddenUntilFound();
  const prefix = useId();

  if (type === 'simple') {
    return (
      <div className="@container">
        <ul className="@w640:table @w640:space-y-0 space-y-3">
          {list.map((article) => {
            return (
              <li key={article.pathname} className="@w640:table-row @w640:leading-[1.875rem] group gap-2">
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
                  <span className="block">
                    <Link href={article.pathname}>{article.title.replaceAll('\n', '')}</Link>
                  </span>
                  <span className="text-secondary @w640:pt-1 block py-1.5 pb-4 text-xs group-last:pb-0">
                    {article.tags?.map?.((tag: string) => `#${tag}`).join(' ')}
                  </span>
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
      <ul className="@w400:grid-cols-2 @w800:grid-cols-3 @w1280:grid-cols-4 grid gap-x-4 gap-y-8">
        {list.map((article) => {
          const titleId = `${prefix}-${article.pathname}-title`;
          const infoId = `${prefix}-${article.pathname}-info`;
          const generatedOgp = `/generated-ogp${article.pathname}.png`;

          return (
            <li key={article.pathname} className="grid gap-2">
              <Link
                href={article.pathname}
                className="bg-secondary group grid grid-rows-[auto_1fr] rounded-md pb-2 no-underline [box-shadow:0_0_2px_1px_rgba(0,0,0,0.1)]"
                aria-labelledby={`${titleId} ${infoId}`}
              >
                <div className="relative z-0 overflow-hidden">
                  <Picture
                    src={
                      type === 'thumbnail'
                        ? (resolveArticleImagePath({
                            imagePath: article.ogImage,
                            category: article.pathname.split('/')[2],
                            year: article.pathname.split('/')[3],
                          }) ?? generatedOgp)
                        : generatedOgp
                    }
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

                <div className="grid grid-rows-[1fr_auto_auto]">
                  <div
                    className="content-center px-3 group-hover:underline"
                    {...(type === 'thumbnail' ? {} : untilFound)}
                  >
                    <div className="pb-1 leading-snug" id={titleId}>
                      {article.title.replaceAll('\n', '')}
                    </div>
                  </div>

                  <div className="text-secondary px-3 text-xs">
                    {article.tags?.map?.((tag: string) => `#${tag}`).join(' ')}
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
