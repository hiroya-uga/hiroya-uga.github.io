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
import { objectKeys } from '@/utils/object-keys';
import { getArticles } from '@/utils/ssg-articles';
import Link from 'next/link';
import { getArticleMarkdownFilePath } from './utils';

type Props = {
  category: ArticleCategory;
};

export const CategoryPage = async ({ category }: Props) => {
  const articlePromises = objectKeys(ARTICLE_PATH_PATTERN_LIST)
    .filter((categoryName) => category === categoryName)
    .flatMap((categoryName) => {
      const years = ARTICLE_PATH_PATTERN_LIST[categoryName];
      return years.map((yearValue) => getArticles(getArticleMarkdownFilePath(categoryName, yearValue)));
    });

  const blogs = (await Promise.all(articlePromises)).flat();
  const { pageTitle, description } = getArticlesPageMeta.categoryTop(category);

  const headingText = getSubCategoryListLabel(category);

  return (
    <>
      <GlobalHeader layout="wide-content" />
      <main className="@container px-content-inline">
        <div className="max-w-structure mx-auto mb-8">
          <PageTitle title={pageTitle} description={description} />
          <CategoryLinks currentCategory={category} />
        </div>
        <div className="@w1024:grid-cols-[1fr_minmax(auto,25%)] max-w-structure mx-auto grid gap-x-8 gap-y-20">
          <ArticleList type={category === 'tech-blog' ? 'simple' : 'thumbnail'} list={blogs} />
          <div className="@w1024:w-248px @w1024:ml-auto">
            <h2 className="bg-tertiary px-3 py-1">{headingText}</h2>
            <ul className="bg-secondary px-3 py-3">
              {ARTICLE_PATH_PATTERN_LIST[category].map((year) => (
                <li key={year}>
                  <Link href={`/articles/${category}/${year}`}>
                    {/\d{4}/.test(year) ? `${year}年` : getSubCategoryName(year)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <GlobalFooter currentPageTitle={resolveCategoryName(category)} />
    </>
  );
};
