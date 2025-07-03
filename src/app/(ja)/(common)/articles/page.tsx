import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getAllArticles } from '@/utils/get-articles';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/articles');

export default async function Page() {
  const blogs = await getAllArticles();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p>不定期更新＆工事中。まったりUI調整しています🍵</p>
      </PageTitle>
      <ArticleList list={blogs} />
    </>
  );
}
