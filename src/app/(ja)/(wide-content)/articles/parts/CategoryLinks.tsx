import { ARTICLE_CATEGORY_MAPPING } from '@/constants/articles';
import Link from 'next/link';

type Props = {
  currentCategory?: string;
  currentYear?: string;
};

export const CategoryLinks = ({ currentCategory, currentYear }: Props) => {
  return (
    <div className="flex flex-wrap gap-y-2">
      <p>
        <b>カテゴリ：</b>
      </p>
      <ul className="flex flex-wrap gap-2">
        {Object.entries(ARTICLE_CATEGORY_MAPPING).map(([category, label]) => (
          <li key={category}>
            {category === currentCategory ? (
              <a aria-current="page" className="bg-panel-primary border-primary rounded-md border px-4 py-2 font-bold">
                {label}
              </a>
            ) : (
              <Link
                href={
                  typeof currentYear === 'string' ? `/articles/${category}/${currentYear}` : `/articles/${category}`
                }
                className="bg-panel-primary hover:bg-panel-primary-hover border-primary rounded-md border px-4 py-2"
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
