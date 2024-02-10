import { MediaContent } from '@/app/(ja)/(common)/documents/media/Client';
import { PageTitle } from '@/components/structures/PageTitle';

import { useId } from 'react';

import { Metadata } from 'next';

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title="外部メディアリンク一覧">
        <p>社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。</p>
      </PageTitle>

      <MediaContent id={id} />
    </>
  );
}

export const metadata: Metadata = {
  title: '外部メディアリンク一覧',
  description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
  twitter: {
    card: 'summary_large_image',
    title: '外部メディアリンク一覧',
    description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
  },
};
