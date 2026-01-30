import { DOMAIN_NAME, SITE_AUTHOR } from '@/constants/meta';
import { getPostBySlug } from '@/libs/marked';
import Script from 'next/script';
import { useMemo } from 'react';

interface Props {
  post: ReturnType<typeof getPostBySlug>;
  category: string;
  year: string;
  fileName: string;
  canonical: string;
}

export const ArticleJsonLD = ({ post, category, year, fileName, canonical }: Props) => {
  const json = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post?.meta.title.replace(/\n/g, ''),
      image: `https://${DOMAIN_NAME}/generated-ogp/articles/${category}/${year}/${fileName}.png`,
      datePublished: new Date(post?.meta.publishedAt).toISOString(),
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        url: `https://${DOMAIN_NAME}/about`,
        logo: {
          '@type': 'ImageObject',
          url: `https://${DOMAIN_NAME}/profile.png`,
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    }),
    [post, category, year, fileName, canonical],
  );

  return (
    <Script type="application/ld+json" id="json-ld">
      {JSON.stringify(json)}
    </Script>
  );
};
