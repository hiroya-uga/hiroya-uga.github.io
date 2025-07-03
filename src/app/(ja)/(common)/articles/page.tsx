import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getAllArticles } from '@/utils/article';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/articles');

export default async function Page() {
  const blogs = await getAllArticles();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>不定期更新。カテゴリ別トップはまだありません🍵</p>
      </PageTitle>
      <ArticleList list={blogs} />
    </>
  );
}
