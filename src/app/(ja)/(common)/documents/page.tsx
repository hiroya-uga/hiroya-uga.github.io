import Link from 'next/link';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: '資料集',
  description: 'ドキュメント系をまとめた階層です。',
});

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
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
            key: `UI Notes`,
            title: (
              <>
                <Link href="/documents/ui-notes/">UI Notes</Link>
              </>
            ),
            description: 'Web上に登場するUIに関するメモ書き。',
          },
          {
            key: `Media`,
            title: (
              <>
                <Link href="/documents/media/">Media</Link>
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
