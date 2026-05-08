import { WikiDetailPage } from '@/components/pages/WikiDetailPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { getWikiPost } from '@/libs/wiki';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const post = getWikiPost([]);
  const title = post?.frontmatter.title ?? 'Wiki';
  const description = post?.frontmatter.description ?? '';
  const url = `${URL_ORIGIN}/wiki/`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: 'website',
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function Page() {
  const post = getWikiPost([]);
  const frontmatter = post?.frontmatter;

  return (
    <>
      {frontmatter && (
        <JsonLd
          data={{
            ...DEFAULT_JSON_LD,
            '@type': 'Article',
            name: frontmatter.title,
            headline: frontmatter.title,
            description: frontmatter.description,
            datePublished: frontmatter.publishedAt,
            dateModified: frontmatter.updatedAt,
            url: `${URL_ORIGIN}/wiki/`,
            mainEntityOfPage: `${URL_ORIGIN}/wiki/`,
          }}
        />
      )}
      <WikiDetailPage frontmatter={frontmatter} content={post?.content} toc={post?.toc} />
    </>
  );
}
