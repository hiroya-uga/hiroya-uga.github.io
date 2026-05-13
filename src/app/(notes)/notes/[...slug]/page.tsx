import { NotesDetailPage } from '@/components/pages/NotesDetailPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getAllNotesSlugs, getNotesPost } from '@/libs/notes';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotesSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getNotesPost(slug);

  if (post === null) {
    return notFound();
  }

  const { title, description } = post.frontmatter;
  const pathname = `/notes/${slug.join('/')}`;
  const url = `${URL_ORIGIN}${pathname}/`;
  const ogImage = await generateOgpImage(['notes', ...slug], title);

  return {
    title: `${title} | Notes | ${SITE_NAME}`,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: 'article',
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} ${title}` }],
    },
    twitter: {
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} ${title}` }],
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
  const post = getNotesPost(slug);

  if (post === null) {
    return notFound();
  }

  const { frontmatter } = post;
  const notesIndex = getNotesPost([]);
  const breadcrumbItems = [
    { name: 'ホーム', url: `${URL_ORIGIN}/` },
    { name: notesIndex?.frontmatter.title ?? 'Notes', url: `${URL_ORIGIN}/notes/` },
    ...slug.map((_, i) => {
      const prefixSlug = slug.slice(0, i + 1);
      const prefixPost = getNotesPost(prefixSlug);
      return {
        name: prefixPost?.frontmatter.title ?? slug[i],
        url: `${URL_ORIGIN}/notes/${prefixSlug.join('/')}/`,
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
          url: `${URL_ORIGIN}/notes/${slug.join('/')}/`,
          mainEntityOfPage: `${URL_ORIGIN}/notes/${slug.join('/')}/`,
        }}
        breadcrumbs={breadcrumbItems}
      />
      <NotesDetailPage frontmatter={frontmatter} content={post.content} toc={post.toc} />
    </>
  );
}
