import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { CATEGORIES_SECTION_HEADING_ID } from '@/constants/id';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { resolveCategoryName } from '@/utils/articles';
import { getMetadata } from '@/utils/get-metadata';
import { getAllArticles } from '@/utils/ssg-articles';
import clsx from 'clsx';
import Link from 'next/link';

const MAIN_PAGES = [
  { emoji: '🔧', href: '/tools' },
  { emoji: '🎮', href: '/games' },
  { emoji: '📚', href: '/documents' },
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
      <h3 className={clsx(['mb-2 mt-12 text-xl font-bold', 'w640:mt-0', 'w800:mb-5 w800:text-[1.125rem]'])}>
        Latest Articles
      </h3>

      <ul className="w800:grid w800:gap-x-24PX w800:text-14px">
        {blogs.slice(0, 5).map((article) => {
          const title = article.title.replaceAll('\n', '');
          return (
            <li
              className="w800:grid w800:grid-cols-subgrid w800:col-end-4 w800:col-start-1 w800:pb-3 w800:items-center w800:not-last:border-b w800:not-last:border-b-primary w800:border-dashed w800:min-h-[calc(2lh+0.75rem)] mb-3"
              key={article.pathname}
            >
              <time dateTime={article.publishedAt} className="w800:col-start-1 w800:mr-0 mr-3 font-mono text-sm">
                {intl.format(new Date(article.publishedAt))}
              </time>
              <span
                className={clsx([
                  'text-primary pt-1.25 inline-block content-center border border-solid p-1 text-center font-mono text-sm leading-none',
                  'w800:col-start-2 w800:mt-1px',
                ])}
              >
                {resolveCategoryName(article.pathname)}
              </span>
              <span className="w800:col-start-3 w800:block grid w-full justify-start">
                <Link
                  href={article.pathname}
                  className={clsx(['truncate', 'w800:overflow-visible w800:text-clip w800:whitespace-normal'])}
                >
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
    <div className="bg-tertiary px-content-inline pt-(--x-section-padding-top) pb-(--x-section-padding-bottom)">
      <div className="max-w-content mx-auto">
        <h2 className="outline-none" id={CATEGORIES_SECTION_HEADING_ID}>
          Categories
        </h2>

        <div
          className={clsx([
            'mt-5',
            'w640:mt-7 w640:grid w640:gap-x-16PX w640:grid-cols-[1fr_max(15rem,30%)]',
            'w800:gap-x-32PX',
          ])}
        >
          <ul className="w640:mb-0 w640:space-y-4 w640:col-start-2">
            {MAIN_PAGES.map(({ emoji, href }) => {
              const { pageTitle } = getMetadata(href);
              return (
                <li
                  key={href}
                  className={clsx([
                    'not-last:border-b not-last:border-b-(--background-color-tertiary) group border-solid',
                    'w640:border-0!',
                  ])}
                >
                  <Link
                    href={href}
                    className={clsx([
                      'bg-secondary group relative block overflow-hidden px-4 py-10 no-underline group-first:rounded-t-lg group-last:rounded-b-lg',
                      'w640:rounded-lg w640:grid w640:grid-cols-[max(100px,40%)_1fr] w640:gap-x-4 w640:p-8PX w640:items-center',
                    ])}
                  >
                    <span
                      className={clsx([
                        'select-none',
                        'w640:bg-primary w640:font-emoji w640:pt-1 w640:grid w640:items-center w640:overflow-hidden w640:rounded-md w640:leading-none w640:aspect-4/3 w640:relative pointer-events-none',
                      ])}
                      aria-hidden="true"
                    >
                      <span className="w640:transition-transform w640:duration-300 w640:group-hover:scale-[1.15] w640:blur-none w640:opacity-100 w640:text-[48px] w640:ml-4 w640:relative w640:top-0 blur-xs absolute right-0 top-1.5 text-[200px] leading-none opacity-30">
                        {emoji}
                      </span>

                      <span className="w640:block left-2/5 absolute top-1/4 hidden text-[72px] opacity-5 brightness-0 dark:brightness-[100]">
                        {emoji}
                      </span>
                    </span>
                    <span className="font-bold underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current">
                      <span className="mb-3px w640:size-3 w640:mb-5px w640:ml-1 relative mr-1.5 inline-block size-4 align-middle">
                        <SvgIcon name="arrow2-right" alt="" />
                      </span>
                      {pageTitle}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w640:col-start-1 w640:row-start-1 w640:pl-1 pl-2">
            <ArticleListForTop />
          </div>
        </div>
      </div>
    </div>
  );
};
