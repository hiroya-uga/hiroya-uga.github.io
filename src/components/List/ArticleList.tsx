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
      <ul className="@w640:grid @w640:gap-4 @w640:grid-cols-[auto_1fr] @w640:space-y-0 space-y-6">
        {list.map((article) => {
          return (
            <li
              key={article.pathname}
              className="@w640:col-span-2 @w640:grid @w640:grid-cols-subgrid @w640:leading-[1.875rem] group"
            >
              <time dateTime={article.publishedAt} className="text-secondary text-sm">
                {formattedDateString(new Date(article.publishedAt))}
              </time>
              <span className="@w640:text-lg block w-fit">
                <span className="@w640:mb-1 mb-1.5 block">
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
    <ul className="@w400:grid-cols-2 @w800:grid-cols-3 @w1280:grid-cols-4 grid gap-x-4 gap-y-8">
      {list.map((article) => {
        const titleId = `${prefix}-${article.pathname}-title`;
        const infoId = `${prefix}-${article.pathname}-info`;
        const generatedOgp = `/generated-ogp${article.pathname}.png`;

        return (
          <li key={article.pathname} className="grid gap-2">
            <Link
              href={article.pathname}
              className="bg-secondary group grid grid-rows-[auto_1fr] rounded-md pb-2 no-underline [box-shadow:0_0_2px_1px_rgb(0_0_0/0.1)]"
              aria-labelledby={`${titleId} ${infoId}`}
            >
              <div className="relative z-0 overflow-hidden">
                <Picture
                  src={
                    type === 'thumbnail' && article.ogImage
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
                  {article.topics?.map?.((tag: string) => `#${tag}`).join(' ')}
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
  );
};
