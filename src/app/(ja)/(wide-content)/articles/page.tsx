import { CategoryLinks } from '@/app/(ja)/(wide-content)/articles/parts/CategoryLinks';
import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import { getAllArticles } from '@/utils/ssg-articles';
import Link from 'next/link';

export const metadata = getMetadata('/articles');

export default async function Page() {
  const blogs = await getAllArticles();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <p className="mb-paragraph">
          <Link href="/documents/media/">外部メディアリンク一覧はこちら</Link>をご覧ください。
        </p>
      </PageTitle>
      <div className="space-y-8">
        <CategoryLinks />
        <ArticleList type="og-thumbnail" list={blogs} />
      </div>
    </>
  );
}
