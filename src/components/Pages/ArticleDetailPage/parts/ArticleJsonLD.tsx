import { DOMAIN_NAME, SITE_AUTHOR } from '@/constants/meta';
import { getPostBySlug } from '@/libs/marked';
import Script from 'next/script';
import { useMemo } from 'react';

interface Props {
  post: ReturnType<typeof getPostBySlug>;
  category: string;
  yearOrSubcategory: string;
  fileName: string;
  canonical: string;
}

const parse = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return undefined;
};

export const ArticleJsonLD = ({ post, category, yearOrSubcategory, fileName, canonical }: Props) => {
  const json = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': category === 'tech-blog' ? 'TechArticle' : 'BlogPosting',
      headline: post?.meta.title.replace(/\n/g, ''),
      description: parse(post?.meta.description),
      proficiencyLevel: parse(post?.meta.proficiencyLevel),
      keywords: post?.meta.topics,
      dependencies: parse(post?.meta.dependencies),
      image: `https://${DOMAIN_NAME}/generated-ogp/articles/${category}/${yearOrSubcategory}/${fileName}.png`,
      datePublished: new Date(post?.meta.publishedAt).toISOString(),
      dateModified: post?.meta.updatedAt ? new Date(post?.meta.updatedAt).toISOString() : undefined,
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        url: `https://${DOMAIN_NAME}/about/`,
        sameAs: 'https://x.com/hiroya_UGA',
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_AUTHOR,
        url: `https://${DOMAIN_NAME}/about/`,
        logo: {
          '@type': 'ImageObject',
          url: `https://${DOMAIN_NAME}/favicon.png`,
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
      inLanguage: 'ja',
    }),
    [post, category, yearOrSubcategory, fileName, canonical],
  );

  return (
    <Script type="application/ld+json" id="json-ld">
      {JSON.stringify(json)}
    </Script>
  );
};
