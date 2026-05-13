import { NotesDetailPage } from '@/components/pages/NotesDetailPage';
import { JsonLd } from '@/components/structures/JsonLd';
import { DEFAULT_JSON_LD, SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { generateOgpImage } from '@/libs/generate-ogp';
import { getNotesPost } from '@/libs/notes';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const post = getNotesPost([]);
  const title = post?.frontmatter.title ?? 'Notes';
  const description = post?.frontmatter.description ?? '';
  const url = `${URL_ORIGIN}/notes/`;
  const ogImage = await generateOgpImage(['notes', 'index'], title);

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title,
      description,
      type: 'website',
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

export default function Page() {
  const post = getNotesPost([]);
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
            url: `${URL_ORIGIN}/notes/`,
            mainEntityOfPage: `${URL_ORIGIN}/notes/`,
          }}
        />
      )}
      <NotesDetailPage frontmatter={frontmatter} content={post?.content} toc={post?.toc} />
    </>
  );
}
