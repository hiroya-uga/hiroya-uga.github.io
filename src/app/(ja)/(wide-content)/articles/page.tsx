import { CategoryLinks } from '@/app/(ja)/(wide-content)/articles/parts/CategoryLinks';
import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';
import { getAllArticles } from '@/utils/ssg-articles';
import Link from 'next/link';

export const metadata = getMetadata('/articles');

const { pageTitle, description } = metadata;

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'Blog',
  name: pageTitle,
  description: description,
  url: `${URL_ORIGIN}/articles`,
};

export default async function Page() {
  const blogs = await getAllArticles();

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <PageTitle title={pageTitle} description={description}>
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
