import { getArticleMarkdownFilePath, getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { ArticleList } from '@/components/List';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';
import { PageTitle } from '@/components/structures/PageTitle';
import { ARTICLE_PATH_PATTERN_LIST } from '@/constants/articles';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';

type Props = {
  category: string;
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
      <Header />
      <main className="@container px-content-inline lg:pl-10">
        <div className="max-w-content mx-auto">
          <PageTitle title={pageTitle} description={description}>
            <p>※ 仮設ページです。</p>
          </PageTitle>
          <ArticleList list={blogs} />
        </div>
      </main>
      <Footer currentPageTitle={resolveCategoryName(category)} />
    </>
  );
};
