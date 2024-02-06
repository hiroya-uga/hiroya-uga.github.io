import { SimpleDescriptionList } from '@/components/List';
import { TranslationsToc } from '@/components/includes/documents/TranslationsToc';

import { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1 className="mb-0">資料集</h1>
      <p className="mb-12">ドキュメント系をまとめた階層です。</p>

      <h2>日本語訳</h2>

      <TranslationsToc />

      <h2>その他</h2>

      <SimpleDescriptionList
        list={[
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
