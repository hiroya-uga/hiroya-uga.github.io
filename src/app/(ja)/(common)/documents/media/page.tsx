import { useId } from 'react';
import { MediaContent } from '@/app/(ja)/(common)/documents/media/Client';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Media',
  description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
});

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>

      <MediaContent id={id} />
    </>
  );
}
