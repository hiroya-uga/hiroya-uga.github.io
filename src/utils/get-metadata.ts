import { Metadata as MetadataOrigin } from 'next';

import { SITE_NAME, URL_ORIGIN } from '@/constants/meta';
import { SEO } from '@/constants/seo';

export type Metadata = MetadataOrigin & {
  pageTitle: string;
  previous?: string;
  title: string;
  following?: string;
  description: string;
};

export const getMetadata = (pathname: keyof typeof SEO): Metadata => {
  const {
    title: pageTitle,
    beforeSubTitle,
    afterSubTitle,
    description,
    languages,
    locale,
  } = (() => {
    if (pathname in SEO) {
      return SEO[pathname];
    }

    return {
      title: '',
      beforeSubTitle: '',
      afterSubTitle: '',
      description: '',
      languages: undefined,
    };
  })();

  const titleValue = (() => {
    if (pageTitle === SITE_NAME) {
      return SITE_NAME;
    }

    return `${beforeSubTitle ? beforeSubTitle : ''}${pageTitle}${afterSubTitle ? ` - ${afterSubTitle}` : ''} | ${SITE_NAME}`;
  })();

  return {
    pageTitle,
    previous: beforeSubTitle,
    following: afterSubTitle,
    title: titleValue,
    description,
    alternates: {
      canonical: `${URL_ORIGIN}${pathname}`,
      ...(languages && {
        languages: Object.fromEntries(Object.entries(languages).map(([lang, path]) => [lang, `${URL_ORIGIN}${path}`])),
      }),
    },
    twitter: {
      creator: '@hiroya_UGA',
      card: 'summary_large_image',
      title: titleValue,
      description,
    },
    openGraph: {
      siteName: SITE_NAME,
      locale: locale || 'ja_JP',
    },
  };
};
