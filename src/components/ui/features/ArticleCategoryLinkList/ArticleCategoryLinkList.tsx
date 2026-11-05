import { ARTICLE_CATEGORY_LABEL_MAPPING } from '@/constants/articles';
import Link from 'next/link';
import { useId } from 'react';

interface Props {
  currentCategory?: string;
  currentYear?: string;
}

export const ArticleCategoryLinkList = ({ currentCategory }: Props) => {
  const id = useId();

  return (
    <div className="flex flex-wrap gap-y-2">
      <p>
        <b id={id}>記事カテゴリ：</b>
      </p>
      <ul className="text-14px w640:text-base gap-8PX flex flex-wrap leading-none" aria-labelledby={id}>
        {Object.entries(ARTICLE_CATEGORY_LABEL_MAPPING).map(([category, label]) => (
          <li key={category}>
            {category === currentCategory ? (
              <a
                aria-current="page"
                className="bg-panel-primary border-primary py-7px w640:py-6px block rounded-md border px-4 font-bold"
              >
                {label}
              </a>
            ) : (
              <Link
                href={`/articles/${category}`}
                className="bg-panel-primary hover:bg-panel-primary-hover border-primary py-7px w640:py-6px block rounded-md border px-4 no-underline hover:underline"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
