import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

import Link from 'next/link';

export const metadata: Metadata = {
  title: '資料集',
  description: 'ドキュメント系をまとめた階層です。',
  twitter: {
    card: 'summary_large_image',
    title: '資料集',
    description: 'ドキュメント系をまとめた階層です。',
  },
};

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.title}>
        <p>{metadata.description}</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
          {
            key: `UI Practices`,
            title: (
              <>
                <Link href="/documents/ui-practices/">UI Practices</Link>
              </>
            ),
            description: 'Web上に登場するUIに関して考察してみたメモ書き。',
          },
          {
            key: `日本語訳まとめ`,
            title: (
              <>
                <Link href="/documents/translations/">日本語訳まとめ</Link>
              </>
            ),
            description: '仕様書など、外部資料を日本語訳したものをまとめた階層です。',
          },
          {
            key: `外部メディアリンク一覧`,
            title: (
              <>
                <Link href="/documents/media/">外部メディアリンク集</Link>
              </>
            ),
            description: '社内ブログや動画コンテンツへの参加、寄稿などのリンクをまとめています。',
          },
          {
            key: `Fantasized Web Standards and Specifications`,
            title: (
              <>
                <Link href="/documents/fantasized-specs/">Fantasized Web Standards and Specifications</Link>
              </>
            ),
            description: '日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
          },
        ]}
      />
    </>
  );
}
