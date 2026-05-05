import { WikiDetailPage } from '@/components/pages/WikiDetailPage';
import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
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

  return <WikiDetailPage frontmatter={post.frontmatter} content={post.content} toc={post.toc} />;
}
