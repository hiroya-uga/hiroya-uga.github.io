import { resolveCategoryName } from '@/utils/article';
import { formattedDateString } from '@/utils/formatter';
import { getAllArticles } from '@/utils/get-articles';
import Link from 'next/link';

export const ArticleListForTop = async () => {
  const blogs = await getAllArticles();

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
                <time
                  dateTime={article.publishedAt}
                  className="text-description @w500:col-start-1 @w500:mr-0 mr-3 font-mono text-sm"
                >
                  {formattedDateString(new Date(article.publishedAt))}
                </time>
                <span className="@w500:col-start-2 font-mono text-sm">
                  {resolveCategoryName(article.pathname.split('/')[2])}
                </span>
                <span className="@w500:col-start-3 block w-full truncate">
                  <Link href={article.pathname} title={title}>
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
