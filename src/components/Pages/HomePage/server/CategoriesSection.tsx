import { SvgIcon } from '@/components/Icons';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { resolveCategoryName } from '@/utils/articles';
import { getMetadata } from '@/utils/get-metadata';
import { getAllArticles } from '@/utils/ssg-articles';
import clsx from 'clsx';
import Link from 'next/link';

const MAIN_PAGES = [
  { emoji: '🔧', href: '/tools' },
  { emoji: '📚', href: '/documents' },
  { emoji: '🎮', href: '/games' },
  { emoji: '✍️', href: '/articles' },
] as const;

const ArticleListForTop = async () => {
  const blogs = [
    ...(await getAllArticles()),
    ...externalMediaLinkList
      .filter((item) => item.type === 'article')
      .map((item) => ({
        title: item.title,
        pathname: item.href,
        publishedAt: item.date,
      })),
  ].sort((a, b) => {
    const aDate = new Date(a.publishedAt);
    const bDate = new Date(b.publishedAt);
    if (aDate.getTime() < bDate.getTime()) {
      return 1;
    }
    if (aDate.getTime() > bDate.getTime()) {
      return -1;
    }
    return 0;
  });

  const intl = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <h3 className="@w640:mt-3.5 mb-2 mt-11 font-bold">Latest Articles</h3>

      <ul className="@w640:grid @w640:pl-3 @w640:gap-y-2 @w640:gap-x-4 @w640:leading-36px grid-cols-[auto_auto_1fr]">
        {blogs.slice(0, 3).map((article) => {
          const title = article.title.replaceAll('\n', '');
          return (
            <li
              className="@w640:grid @w640:grid-cols-subgrid @w640:col-end-4 @w640:col-start-1 @w640:mb-0 mb-3"
              key={article.pathname}
            >
              <time dateTime={article.publishedAt} className="@w640:col-start-1 @w640:mr-0 mr-3 font-mono text-sm">
                {intl.format(new Date(article.publishedAt))}
              </time>
              <span className="@w640:col-start-2 text-center font-mono text-sm">
                {resolveCategoryName(article.pathname)}
              </span>
              <span className="@w640:col-start-3 grid w-full justify-start">
                <Link href={article.pathname} className="truncate">
                  {title}
                </Link>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const CategoriesSection = () => {
  return (
    <div className="bg-tertiary px-content-inline @w640:py-28 py-11 pb-12">
      <div className="max-w-content mx-auto">
        <h2 className="@w640:text-2xl mb-11 text-xl font-bold tracking-wide outline-none" id="heading-categories">
          Categories
        </h2>

        <div className="@w640:grid @w640:grid-cols-3 @w640:gap-x-4 @w640:gap-8">
          <ul className="@w640:grid @w640:grid-cols-subgrid @w640:grid-rows-subgrid @w640:col-start-1 @w640:col-end-4 @w640:mb-0 @w640:row-start-1 @w640:row-end-3">
            {MAIN_PAGES.map(({ emoji, href }) => {
              const { pageTitle } = getMetadata(href);
              return (
                <li
                  key={href}
                  className="not-last:border-b not-last:border-b-(--background-color-tertiary) @w640:border-0! group border-solid"
                >
                  <Link
                    href={href}
                    className="@w640:p-0 @w640:rounded-md bg-secondary @w640:bg-transparent group relative block overflow-hidden px-4 py-10 no-underline group-first:rounded-t-lg group-last:rounded-b-lg"
                  >
                    <span
                      className={clsx([
                        '@w640:bg-primary @w640:font-emoji @w640:mb-2 @w640:grid @w640:aspect-[1.618/1] @w640:place-items-center @w640:overflow-hidden @w640:rounded-md @w640:leading-none',
                        // safari bug fix: https://iwb.jp/safari-css-display-grid-place-items-center-bug
                        '@w640:w-full',
                      ])}
                      aria-hidden="true"
                    >
                      <span className="@w640:transition-transform @w640:duration-300 @w640:group-hover:scale-[1.15] @w640:blur-none @w640:opacity-100 @w640:text-5xl @w640:relative @w640:top-0 blur-xs absolute right-0 top-1.5 text-[200px] leading-none opacity-30">
                        {emoji}
                      </span>
                    </span>
                    <span className="font-bold underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current">
                      <span className="mb-3px @w640:size-3 @w640:mb-5px @w640:ml-1 relative mr-1.5 inline-block size-4 align-middle">
                        <SvgIcon name="arrow2-right" alt="" />
                      </span>
                      {pageTitle}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="@w640:col-start-2 @w640:col-end-4 @w640:row-start-2 @w640:row-end-3 @w640:pl-0 pl-2">
            <ArticleListForTop />
          </div>
        </div>
      </div>
    </div>
  );
};
