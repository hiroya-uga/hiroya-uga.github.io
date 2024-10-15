import { Metadata as MetadataOrigin } from 'next';
import { SITE_NAME } from '@/constants/meta';

export type Metadata = MetadataOrigin & {
  title: string;
};

export const getMetadata = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata & {
  pageTitle: string;
} => {
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
    twitter: {
      card: 'summary_large_image',
      title: titleValue,
      description,
    },
  };
};
