'use client';

import { Picture } from '@/components/ui/features/Picture';
import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { useHiddenUntilFound } from '@/hooks/use-hidden-until-found';
import { resolveArticleImagePath, resolveCategoryName } from '@/utils/articles';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/ssg-articles';
import Link from 'next/link';
import { useId } from 'react';

type Props = {
  article: ArticleFrontMatter;
  type: 'thumbnail' | 'og-thumbnail';
};

export const ArticleCard = ({ article, type }: Readonly<Props>) => {
  const untilFound = useHiddenUntilFound();
  const prefix = useId();
  const titleId = `${prefix}-${article.pathname}-title`;
  const infoId = `${prefix}-${article.pathname}-info`;
  const generatedOgp = `/generated-ogp${article.pathname}.png`;

  return (
    <div className="grid gap-2">
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
          <div className="content-center px-3 group-hover:underline" {...(type === 'thumbnail' ? {} : untilFound)}>
            <div className="pb-1 leading-snug" id={titleId}>
              {article.title.replaceAll('\n', '')}
            </div>
          </div>

          <div className="text-secondary px-3 text-xs">
            {article.topics?.map?.((tag: string) => `#${tag}`).join(' ')}
          </div>

          <div className="flex items-center justify-between pl-3 pr-2" id={infoId}>
            <time dateTime={article.publishedAt} className="text-primary @w240:text-sm text-12px">
              {formattedDateString(new Date(article.publishedAt))}
            </time>
            <div className="text-primary pt-1.25 ml-2 inline-block content-center border border-solid p-1 text-center text-sm leading-none">
              {resolveCategoryName(article.pathname.split('/')[2])}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
