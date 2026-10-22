import { Picture } from '@/components/ui/features/Picture';
import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { CATEGORIES_SECTION_HEADING_ID } from '@/constants/id';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { resolveArticleImagePath, resolveCategoryName } from '@/utils/articles';
import { getMetadata } from '@/utils/get-metadata';
import { type ArticleFrontMatter, getAllArticles } from '@/utils/ssg-articles';
import clsx from 'clsx';
import Link from 'next/link';

const MAIN_PAGES = [
  { emoji: '🔧', href: '/tools' },
  { emoji: '🎮', href: '/games' },
  { emoji: '📚', href: '/documents' },
] as const;

const ArticleListForTop = async () => {
  const blogs = [
    ...(await getAllArticles()),
    ...externalMediaLinkList
      .filter((item) => item.type === 'article')
      .map(
        (item): Pick<ArticleFrontMatter, 'title' | 'pathname' | 'publishedAt' | 'ogImage'> => ({
          title: item.title,
          pathname: item.href,
          publishedAt: item.date,
        }),
      ),
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
      {blogs.slice(0, 6).map((article) => {
        const title = article.title.replaceAll('\n', '');
        const [, , category, year] = article.pathname.split('/');
        const thumbnail = article.pathname.startsWith('https://')
          ? undefined
          : ((article.ogImage && resolveArticleImagePath({ imagePath: article.ogImage, category, year })) ??
            `/generated-ogp${article.pathname}.png`);

        return (
          <li className="relative grid" key={article.pathname}>
            <Link href={article.pathname} className="group flex flex-col rounded-sm no-underline">
              <div className="bg-primary aspect-1200/630 overflow-hidden rounded-sm">
                {thumbnail !== undefined && (
                  <Picture src={thumbnail} alt="" width={1200} height={630} className="block size-full object-cover" />
                )}
              </div>
              <div className="px-1PX mt-1.5 grow">
                <span className="w400:tracking-wide group-hover:underline group-focus:underline">{title}</span>
              </div>
              <div className="px-1PX w400:gap-x-6PX w400:flex w400:flex-wrap w400:justify-end ml-auto mt-0.5">
                <time
                  dateTime={article.publishedAt}
                  className="text-primary leading-23px align-middle font-mono text-sm"
                >
                  {intl.format(new Date(article.publishedAt))}
                </time>{' '}
                <span className="text-primary pb-5px p-4px text-12px ml-auto block w-fit content-center border border-solid text-center align-middle font-mono leading-none">
                  {resolveCategoryName(article.pathname)}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
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

        <div className={clsx(['mt-5', 'w640:mt-7'])}>
          <ul className="w640:mb-0 w640:grid w640:grid-cols-3 w640:gap-16PX">
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
                      'w640:rounded-lg w640:grid w640:grid-cols-[max(80px,40%)_1fr] w640:gap-x-16PX w640:p-8PX w640:pr-32PX w640:items-center',
                    ])}
                  >
                    <span
                      className={clsx([
                        'select-none',
                        'w640:bg-primary w640:font-emoji w640:pt-1 w640:grid w640:items-center w640:overflow-hidden w640:rounded-md w640:leading-none w640:aspect-square w640:relative pointer-events-none',
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
                      <span className="mb-3px w640:mb-5px w640:ml-1 mr-6PX w640:mr-12PX w640:hidden w640:size-3 relative inline-block size-4 align-middle">
                        <SvgIcon name="arrow2-right" alt="" className="" />
                      </span>
                      {pageTitle}
                    </span>
                    <SvgIcon
                      name="arrow-right"
                      alt=""
                      className={clsx([
                        'w640:size-3 w640:block',
                        'right-12PX absolute bottom-0 top-0 my-auto hidden size-4 transition-[opacity,right]',
                        'group-hover:right-8PX',
                      ])}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="w640:mt-64px w640:pl-1 mt-12 pl-2">
            <h3 className={clsx(['text-xl font-bold', 'w640:text-[2rem]'])}>Articles</h3>

            <p className="mt-paragraph">
              最近更新された記事の一覧です。<Link href="/articles">記事一覧はこちら</Link>。
            </p>

            <ul
              className={clsx([
                // 1.875の875*0.75
                'w640:mt-[calc(var(--spacing-paragraph)+0.65625em)]',
                'w640:grid-cols-3 w640:text-base w640:gap-y-32px w640:gap-x-24PX',
                'mt-paragraph gap-x-16PX text-14px grid grid-cols-2',
              ])}
            >
              <ArticleListForTop />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
