import { Metadata as MetadataOrigin } from 'next';
import { URL_ORIGIN, SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';

export type Metadata = MetadataOrigin & {
  pageTitle: string;
  title: string;
  description: string;
};

export const getMetadata = (pathname: string): Metadata => {
  const { title, description } = (() => {
    if (pathname in SEO) {
      return SEO[pathname];
    }

    return {
      title: '',
      description: '',
    };
  })();

  const titleValue = (() => {
    if (title === SITE_NAME) {
      return SITE_NAME;
    }

    return `${title} | ${SITE_NAME}`;
  })();

  return {
    pageTitle: title,
    title: titleValue,
    description,
    alternates: {
      canonical: `${URL_ORIGIN}${pathname}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleValue,
      description,
    },
  };
};
