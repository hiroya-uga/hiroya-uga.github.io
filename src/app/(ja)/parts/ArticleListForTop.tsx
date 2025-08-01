import { externalMediaLinkList } from '@/data/external-media-link-list';
import { resolveCategoryName } from '@/utils/articles';
import { getAllArticles } from '@/utils/ssg-articles';
import Link from 'next/link';

export const ArticleListForTop = async () => {
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

  return (
    <>
      <div className="@container">
        <h3 className="@w500:mb-2 @w500:mt-3 my-2 text-lg font-bold">Latest Articles</h3>

        <ul className="@w500:grid @w500:pl-4 @w500:gap-y-2 @w500:gap-x-4 @w500:leading-36px grid-cols-[auto_auto_1fr]">
          {blogs.slice(0, 3).map((article) => {
            const title = article.title.replaceAll('\n', '');
            return (
              <li
                className="@w500:grid @w500:grid-cols-subgrid @w500:col-end-4 @w500:col-start-1 @w500:mb-0 mb-3"
                key={article.pathname}
              >
                <time dateTime={article.publishedAt} className="@w500:col-start-1 @w500:mr-0 mr-3 font-mono text-sm">
                  {article.publishedAt.replace(/-/g, '/')}
                </time>
                <span className="@w500:col-start-2 text-center font-mono text-sm">
                  {resolveCategoryName(article.pathname)}
                </span>
                <span className="@w500:col-start-3 grid w-full justify-start">
                  <Link href={article.pathname} title={title} className="truncate">
                    {title}
                  </Link>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
