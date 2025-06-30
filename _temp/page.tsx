import { DocumentScript } from '@/../_temp/DocumentScript';

import '@/../_temp/page.css';

import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />
    </>
  );
}
