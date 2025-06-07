import { Suspense, useId } from 'react';

import { MediaContent } from '@/app/(ja)/(common)/documents/media/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/media');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>

      <Suspense>
        <MediaContent id={id} />
      </Suspense>
    </>
  );
}
