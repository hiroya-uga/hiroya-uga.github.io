import { getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { CategoryLinks } from '@/app/(ja)/(wide-content)/articles/parts/CategoryLinks';
import { ArticleList } from '@/components/List';
import { GlobalFooter } from '@/components/structures/GlobalFooter';
import { GlobalHeader } from '@/components/structures/GlobalHeader';
import { PageTitle } from '@/components/structures/PageTitle';
import {
  ARTICLE_PATH_PATTERN_LIST,
  ArticleCategory,
  getSubCategoryListLabel,
  getSubCategoryName,
} from '@/constants/articles';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleMarkdownFilePath } from './utils';

type Props = { category: ArticleCategory; yearOrSubcategory: string };

export const YearOrSubCategoryPage = async ({ category, yearOrSubcategory }: Props) => {
  const notExistYearOrSubcategory = ARTICLE_PATH_PATTERN_LIST[category].includes(yearOrSubcategory) === false;

  if (notExistYearOrSubcategory) {
    return notFound();
  }

  const blogs = await getArticles(
    getArticleMarkdownFilePath(category, yearOrSubcategory),
    `/articles/${category}/${yearOrSubcategory}`,
  );
  const { pageTitle, description } = getArticlesPageMeta.yearOrSubCategoryPage(category, yearOrSubcategory);

  const yearOrSubcategoryLabel = getSubCategoryName(yearOrSubcategory);
  const headingText = getSubCategoryListLabel(category);

  return (
    <>
      <GlobalHeader layout="wide-content" />

      <main className="@container px-content-inline lg:pl-10">
        <div className="max-w-structure mx-auto mb-8">
          <PageTitle title={pageTitle} description={description} />
          <CategoryLinks currentCategory={category} />
        </div>
        <div className="@w1024:grid-cols-[1fr_minmax(auto,25%)] max-w-structure mx-auto grid gap-x-8 gap-y-20">
          <ArticleList type={category === 'tech-blog' ? 'simple' : 'thumbnail'} list={blogs} />
          <div className="@w1024:w-248px @w1024:ml-auto">
            <h2 className="bg-tertiary px-3 py-1">{headingText}</h2>
            <ul className="bg-secondary px-3 py-3">
              {ARTICLE_PATH_PATTERN_LIST[category].map((key) => (
                <li key={key}>
                  {key === yearOrSubcategory ? (
                    <a aria-current="page">{yearOrSubcategoryLabel}</a>
                  ) : (
                    <Link href={`/articles/${category}/${key}`}>{yearOrSubcategoryLabel}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <GlobalFooter
        additionalBreadcrumbs={[{ href: `/articles/${category}`, title: resolveCategoryName(category) }]}
        currentPageTitle={getSubCategoryName(yearOrSubcategory)}
      />
    </>
  );
};
