import Mdx from '@/app/(en)/(specs)/documents/fantasized-specs/html-carousel/content.mdx';
import { DOMAIN_NAME, GITHUB_PROFILE, GITHUB_REPOSITORY } from '@/constants/meta';
import { DocumentHeadingLevel2 } from '@/mdx-components';

import { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1>Carousels</h1>

      <DocumentHeadingLevel2>Fantasized Draft, 28 March 2019</DocumentHeadingLevel2>

      <dl>
        <dt>This version:</dt>
        <dd>
          <a href={`https://${DOMAIN_NAME}/documents/fantasized-specs/html-carousel`}>
            https://{DOMAIN_NAME}/documents/fantasized-specs/html-carousel
          </a>
        </dd>
        <dt>Editors:</dt>
        <dd>
          <a href={GITHUB_PROFILE}>Hiroya Uga</a>
        </dd>
        <dt>Issue Tracking:</dt>
        <dd>
          <a
            href={`${GITHUB_REPOSITORY}/blob/main/src/app/(en)/(specs)/documents/fantasized-specs/html-carousel/content.mdx`}
          >
            GitHub Issues
          </a>
        </dd>
      </dl>

      <Mdx />
    </>
  );
}

export const metadata: Metadata = {
  title: 'The carousel element - Fantasized specs',
  description: '',
};
