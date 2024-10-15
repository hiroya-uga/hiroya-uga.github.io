import { MediaContent } from '@/app/(ja)/(common)/documents/media/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

import { useId } from 'react';

export const metadata: Metadata = {
  title: 'Media',
  description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
  twitter: {
    card: 'summary_large_image',
    title: 'Media',
    description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
  },
};

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.title}>
        <p>{metadata.description}</p>
      </PageTitle>

      <MediaContent id={id} />
    </>
  );
}
