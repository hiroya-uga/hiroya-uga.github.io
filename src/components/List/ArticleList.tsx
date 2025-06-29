import { resolveCategoryName } from '@/utils/article';
import { formattedDateString } from '@/utils/formatter';
import { ArticleFrontMatter } from '@/utils/get-articles';
import Link from 'next/link';

type Props = {
  list: ArticleFrontMatter[];
};

export const ArticleList = ({ list }: Props) => {
  return (
    <div className="@container">
      <ul className="@w640:table space-y-3">
        {list.map((article) => {
          return (
            <li key={article.pathname} className="@w640:table-row leading-36px gap-2">
              <time className="text-description @w640:mr-0 @w640:table-cell mr-3 text-sm">
                {formattedDateString(new Date(article.publishedAt))}
              </time>
              <span className="@w640:table-cell @w640:px-4 text-sm">
                {resolveCategoryName(article.pathname.split('/')[2])}
              </span>
              <Link href={article.pathname} className="@w640:text-lg @w640:table-cell block w-fit">
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
