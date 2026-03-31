import { CategoryLinks } from '@/app/(ja)/(wide-content)/articles/parts/CategoryLinks';
import { ArticleList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { DEFAULT_JSON_LD, SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getMetadata } from '@/utils/get-metadata';
import { getAllArticles } from '@/utils/ssg-articles';
import { Metadata } from 'next';
import Link from 'next/link';

const metadata = getMetadata('/articles');
const { pageTitle, description } = metadata;

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'Blog',
  name: pageTitle,
  description: description,
  url: `${URL_ORIGIN}/articles/`,
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
export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await generateOgpImage(['articles'], pageTitle);
  const url = `${URL_ORIGIN}/articles/`;

  return {
    title: pageTitle,
    description,
    twitter: {
      creator: '@hiroya_UGA',
    },
    openGraph: {
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      type: 'website',
      url,
      images: [
        {
          url: ogImage,
          alt: `${SITE_NAME} ${pageTitle}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}
