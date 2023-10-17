import Mdx from '@/app/(en)/(specs)/documents/fantasized-specs/css-observer/content.mdx';
import { META } from '@/constants/meta';
import { DocumentHeadingLevel2 } from '@/mdx-components';

import { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1>CSS Observer Module level 1</h1>

      <DocumentHeadingLevel2>Fantasized Draft, 28 March 2019</DocumentHeadingLevel2>

      <dl>
        <dt>This version:</dt>
        <dd>
          <a href={`https://${META.domain}/documents/fantasized-specs/css-observer`}>
            https://{META.domain}/documents/fantasized-specs/css-observer
          </a>
        </dd>
        <dt>Editors:</dt>
        <dd>
          <a href={META.github}>Hiroya Uga</a>
        </dd>
        <dt>Issue Tracking:</dt>
        <dd>
          <a
            href={`${META.repository}/blob/main/src/app/(en)/(specs)/documents/fantasized-specs/css-observer/content.mdx`}
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
  title: 'CSS Observer Module level 1 - Fantasized specs',
  description: '',
};
