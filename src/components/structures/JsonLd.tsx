import { BreadcrumbList, ListItem, WithContext } from 'schema-dts';

import { URL_ORIGIN } from '@/constants/meta';
import { BreadcrumbItem, buildBreadcrumbsFromPath } from '@/utils/breadcrumb';

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

const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, url }, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: url,
  })) as ListItem[],
});

interface Props {
  data: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

export const JsonLd = ({ data, breadcrumbs }: Readonly<Props>) => {
  const sanitized = removeNewlines(data);
  const dataUrl = typeof data.url === 'string' ? data.url : undefined;
  const pathname = dataUrl ? dataUrl.replace(URL_ORIGIN, '').replace(/\/$/, '') : undefined;
  const resolvedBreadcrumbs = breadcrumbs ?? (pathname ? buildBreadcrumbsFromPath(pathname) : undefined);

  return (
    <>
      <script
        key="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitized) }}
      />
      {resolvedBreadcrumbs && resolvedBreadcrumbs.length > 0 && (
        <script
          key="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(resolvedBreadcrumbs)) }}
        />
      )}
    </>
  );
};

/** @deprecated Use JsonLd with Article data and breadcrumbs prop instead */
export const JsonLdForNote = ({
  title,
  description,
  publishedAt,
  updatedAt,
  pathname,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt?: string;
  pathname: string;
  breadcrumbs?: BreadcrumbItem[];
  /** @deprecated use breadcrumbs */
  breadcrumbItems?: BreadcrumbItem[];
}) => {
  const url = `${URL_ORIGIN}${pathname}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: title,
    headline: title,
    description: description ?? '',
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

  return <JsonLd data={jsonLd} breadcrumbs={breadcrumbs} />;
};
