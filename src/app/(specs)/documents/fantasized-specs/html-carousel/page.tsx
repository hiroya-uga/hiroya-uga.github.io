import Mdx from '@/app/(specs)/documents/fantasized-specs/html-carousel/content.mdx';
import { META } from '@/constants/meta';
import { DocumentHeadingLevel2 } from '@/mdx-components';

export default function Page() {
  return (
    <>
      <h1>Carousels</h1>

      <DocumentHeadingLevel2>Fantasized Draft, 28 March 2019</DocumentHeadingLevel2>

      <dl>
        <dt>This version:</dt>
        <dd>
          <a href={`https://${META.domain}/documents/fantasized-specs/html-carousel`}>
            https://{META.domain}/documents/fantasized-specs/html-carousel
          </a>
        </dd>
        <dt>Editors:</dt>
        <dd>
          <a href="https://github.com/hiroya-uga">Hiroya Uga</a>
        </dd>
        <dt>Issue Tracking:</dt>
        <dd>
          <a href="https://github.com/hiroya-uga/hiroya-uga.github.io/blob/main/src/app/documents/fantasized-specs/html-carousel/content.mdx">
            GitHub Issues
          </a>
        </dd>
      </dl>

      <Mdx />
    </>
  );
}
