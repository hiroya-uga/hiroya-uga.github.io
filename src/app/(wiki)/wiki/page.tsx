import { WikiDetailPage } from '@/components/pages/WikiDetailPage';
import { JsonLdForNote } from '@/components/structures/JsonLd';
import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
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
        <JsonLdForNote
          title={frontmatter.title}
          description={frontmatter.description}
          publishedAt={frontmatter.publishedAt ?? frontmatter.updatedAt}
          updatedAt={frontmatter.updatedAt}
          pathname="/wiki/"
        />
      )}
      <WikiDetailPage frontmatter={frontmatter} content={post?.content} toc={post?.toc} />
    </>
  );
}
