import { SimpleDescriptionList } from '@/components/List';

import { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1 className="mb-0">資料集</h1>
      <p className="mb-12">ドキュメント系をまとめた階層です。</p>

      <SimpleDescriptionList
        list={[
          {
            key: `日本語訳集`,
            title: (
              <>
                <Link href="/documents/translations/">日本語訳</Link>
              </>
            ),
            description: '仕様書など、外部資料を日本語訳したものをまとめた階層です。',
          },
          {
            key: `Fantasized Web Standards and Specifications`,
            title: (
              <>
                <Link href="/documents/fantasized-specs/">Fantasized Web Standards and Specifications</Link>
              </>
            ),
            description: 'English Only. 日々業務の中で思いついた「あんなこといいなできたらいいな」集。',
          },
        ]}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: '資料集',
  description: 'ドキュメント系をまとめた階層です。',
};
