import { WikiDetailPage } from '@/components/pages/WikiDetailPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { getAllWikiSlugs, getWikiPost } from '@/libs/wiki';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWikiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getWikiPost(slug);

  if (post === null) {
    return notFound();
  }

  const { title, description } = post.frontmatter;
  const pathname = `/wiki/${slug.join('/')}`;
  const url = `${URL_ORIGIN}${pathname}/`;

  return {
    title: `${title} | Wiki | ${SITE_NAME}`,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: 'article',
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function Page({ params }: Readonly<Props>) {
  const { slug } = await params;
  const post = getWikiPost(slug);

  if (post === null) {
    return notFound();
  }

  const { frontmatter } = post;
  const wikiIndex = getWikiPost([]);
  const breadcrumbItems = [
    { name: 'ホーム', url: `${URL_ORIGIN}/` },
    { name: wikiIndex?.frontmatter.title ?? 'Wiki', url: `${URL_ORIGIN}/wiki/` },
    ...slug.map((_, i) => {
      const prefixSlug = slug.slice(0, i + 1);
      const prefixPost = getWikiPost(prefixSlug);
      return {
        name: prefixPost?.frontmatter.title ?? slug[i],
        url: `${URL_ORIGIN}/wiki/${prefixSlug.join('/')}/`,
      };
    }),
  ];

  return (
    <>
      <JsonLd
        data={{
          ...DEFAULT_JSON_LD,
          '@type': 'Article',
          name: frontmatter.title,
          headline: frontmatter.title,
          description: frontmatter.description,
          datePublished: frontmatter.publishedAt,
          dateModified: frontmatter.updatedAt,
          url: `${URL_ORIGIN}/wiki/${slug.join('/')}/`,
          mainEntityOfPage: `${URL_ORIGIN}/wiki/${slug.join('/')}/`,
        }}
        breadcrumbs={breadcrumbItems}
      />
      <WikiDetailPage frontmatter={frontmatter} content={post.content} toc={post.toc} />
    </>
  );
}
