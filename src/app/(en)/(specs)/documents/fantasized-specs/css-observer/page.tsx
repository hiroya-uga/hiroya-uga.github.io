import Mdx from '@/app/(en)/(specs)/documents/fantasized-specs/css-observer/content.mdx';
import { GITHUB_PROFILE, GITHUB_REPOSITORY, URL_ORIGIN } from '@/constants/meta';
import { DocumentHeadingLevel2 } from '@/mdx-components';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/fantasized-specs/css-observer');

export default function Page() {
  return (
    <>
      <h1>CSS Observer Module level 1</h1>

      <DocumentHeadingLevel2>Fantasized Draft, 28 March 2019</DocumentHeadingLevel2>

      <dl>
        <dt>This version:</dt>
        <dd>
          <a href={`${URL_ORIGIN}/documents/fantasized-specs/css-observer`}>
            {URL_ORIGIN}/documents/fantasized-specs/css-observer
          </a>
        </dd>
        <dt>Editors:</dt>
        <dd>
          <a href={GITHUB_PROFILE}>Hiroya Uga</a>
        </dd>
        <dt>Issue Tracking:</dt>
        <dd>
          <a
            href={`${GITHUB_REPOSITORY}/blob/main/src/app/(en)/(specs)/documents/fantasized-specs/css-observer/content.mdx`}
          >
            GitHub Issues
          </a>
        </dd>
      </dl>

      <Mdx />
    </>
  );
}
