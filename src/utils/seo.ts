import { Metadata as MetadataOrigin } from 'next';
import { URL_ORIGIN, SITE_NAME } from '@/constants/meta';
import { SEO } from '@/constants/seo';

export type Metadata = MetadataOrigin & {
  pageTitle: string;
  previous?: string;
  title: string;
  following?: string;
  description: string;
};

export const getMetadata = (pathname: string): Metadata => {
  const { title, beforeSubTitle, afterSubTitle, description } = (() => {
    if (pathname in SEO) {
      return SEO[pathname];
    }

    return {
      title: '',
      beforeSubTitle: '',
      afterSubTitle: '',
      description: '',
    };
  })();

  const titleValue = (() => {
    if (title === SITE_NAME) {
      return SITE_NAME;
    }

    return `${beforeSubTitle ? beforeSubTitle : ''}${title}${afterSubTitle ? ` - ${afterSubTitle}` : ''} | ${SITE_NAME}`;
  })();

  return {
    pageTitle: title,
    previous: beforeSubTitle,
    following: afterSubTitle,
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
