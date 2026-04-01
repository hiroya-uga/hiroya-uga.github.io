import { Article, WebPage, WithContext } from 'schema-dts';

import { URL_ORIGIN } from '@/constants/meta';

const removeNewLinesTarget = ['name', 'title', 'description'];

type ObjectValue = Record<string, unknown>;

const isObjectValue = (value: unknown): value is ObjectValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const removeNewlines = (object: ObjectValue): ObjectValue => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      if (removeNewLinesTarget.includes(key) && typeof value === 'string') {
        return [key, value.replace(/\n/g, '').trim()];
      }

      if (isObjectValue(value)) {
        return [key, removeNewlines(value)];
      }

      return [key, value];
    }),
  );
};

export const JsonLd = ({ data }: { data: Record<string, unknown> }) => {
  const sanitized = removeNewlines(data);

  return (
    <script key="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitized) }} />
  );
};

export const JsonLdForNote = ({
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
      sameAs: 'https://x.com/hiroya_UGA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hiroya.UGA',
      logo: {
        '@type': 'ImageObject',
        url: `${URL_ORIGIN}/common/images/profile.png`,
      },
    },
  };

  return (
    <script key="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
};
