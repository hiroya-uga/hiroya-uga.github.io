import { getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { CategoryLinks } from '@/app/(ja)/(wide-content)/articles/parts/CategoryLinks';
import { ArticleList } from '@/components/List';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';
import { PageTitle } from '@/components/structures/PageTitle';
import { ARTICLE_PATH_PATTERN_LIST, ArticleCategory } from '@/constants/articles';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';
import Link from 'next/link';
import { getArticleMarkdownFilePath } from './utils/get-article-markdown-file-path';

type Props = {
  category: ArticleCategory;
};

export const CategoryPage = async ({ category }: Props) => {
  const articlePromises = Object.entries(ARTICLE_PATH_PATTERN_LIST)
    .filter(([categoryName]) => category === categoryName)
    .flatMap(([categoryName, years]) => {
      return years.map((yearValue) => getArticles(getArticleMarkdownFilePath(categoryName, yearValue)));
    });

  const blogs = (await Promise.all(articlePromises)).flat();
  const { pageTitle, description } = getArticlesPageMeta.categoryTop(category);

  return (
    <>
      <Header layout="wide-content" />
      <main className="@container px-content-inline lg:pl-10">
        <div className="max-w-structure mx-auto mb-8">
          <PageTitle title={pageTitle} description={description} />
          <CategoryLinks currentCategory={category} />
        </div>
        <div className="@w1024:grid-cols-[1fr_minmax(auto,25%)] max-w-structure mx-auto grid gap-x-8 gap-y-20">
          <ArticleList type={category === 'blog' ? 'thumbnail' : 'simple'} list={blogs} />
          <div className="@w1024:w-[248px] @w1024:ml-auto">
            <h2 className="bg-tertiary px-3 py-1">過去ログ</h2>
            <ul className="bg-secondary px-3 py-3">
              {ARTICLE_PATH_PATTERN_LIST[category].map((year) => (
                <li key={year}>
                  <Link href={`/articles/${category}/${year}`}>{year}年</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer currentPageTitle={resolveCategoryName(category)} />
    </>
  );
};
