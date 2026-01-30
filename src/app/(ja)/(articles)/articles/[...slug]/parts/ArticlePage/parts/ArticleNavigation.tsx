import { SvgIcon } from '@/components/Icons';
import { ArticleCategoryLabel } from '@/constants/articles';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  article: { pathname: string; title: string };
  categoryName: ArticleCategoryLabel;
  direction: 'previous' | 'next';
}

export const ArticleNavigation = ({ article, categoryName, direction }: Props) => {
  const isPrevious = direction === 'previous';

  return (
    <Link
      href={article.pathname}
      className={clsx([
        'hover:bg-secondary ${paddingClass} relative block rounded-lg border border-[#00000022] p-3 text-inherit no-underline transition-[box-shadow,background-color] hover:shadow-lg dark:border-[#ffffff44]',
        isPrevious ? '@w640:pl-10 @w640:pr-6 px-10' : '@w640:pl-6 @w640:pr-10 px-10',
      ])}
    >
      <span className={clsx(['absolute inset-y-0 my-auto block size-4', isPrevious ? 'left-3' : 'right-3'])}>
        <SvgIcon name={isPrevious ? 'arrow-left' : 'arrow-right'} alt="" />
      </span>
      <span className="block text-xs">{isPrevious ? `前の${categoryName}記事：` : `次の${categoryName}記事：`}</span>
      <span className="text-link block text-sm">
        {article.title.split('\n').map((line, index) => {
          const key = `${line}-${index}`;
          return (
            <span key={key} className="underline last:inline-block">
              {line}
            </span>
          );
        })}
      </span>
    </Link>
  );
};
