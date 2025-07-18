import { getArticleMarkdownFilePath, getArticlesPageMeta } from '@/app/(ja)/(articles)/articles/[...slug]/utils';
import { ArticleList } from '@/components/List';
import { Footer } from '@/components/structures/Footer';
import { Header } from '@/components/structures/Header';
import { PageTitle } from '@/components/structures/PageTitle';
import { resolveCategoryName } from '@/utils/articles';
import { getArticles } from '@/utils/ssg-articles';

type Props = { category: string; year: string };

export const YearPage = async ({ category, year }: Props) => {
  const blogs = await getArticles(getArticleMarkdownFilePath(category, year));
  const { pageTitle, description } = getArticlesPageMeta.yearTop(category, year);

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
      <Footer
        additionalBreadcrumbs={[{ href: `/articles/${category}`, title: resolveCategoryName(category) }]}
        currentPageTitle={year}
      />
    </>
  );
};
