import { Article, WebPage, WithContext } from 'schema-dts';
import { URL_ORIGIN } from '@/constants/meta';

export const JsonLd = ({
  title,
  description,
  publishedAt,
  updatedAt,
  pathname,
}: {
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt?: string;
  pathname: string;
}) => {
  const url = `${URL_ORIGIN}${pathname}`;
  const jsonLd: WithContext<Article | WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: title,
    headline: title,
    description: description ?? '',
    // image: `${process.env.NEXT_PUBLIC_BASE_URL}/img/icon_r.webp`,
    datePublished: publishedAt,
    dateModified: updatedAt,
    url,
    mainEntityOfPage: url,
    author: {
      '@type': 'Person',
      name: 'Hiroya.UGA',
      url: URL_ORIGIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hiroya.UGA',
      logo: {
        '@type': 'ImageObject',
        url: `${URL_ORIGIN}/profile.png`,
      },
    },
  };

  return (
    <script key="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
};
