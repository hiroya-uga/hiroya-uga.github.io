import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <PageTitle title="ツール集">
        <p>作ったものをまとめている階層です。</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
          {
            key: `代替テキスト２択チャート`,
            title: (
              <>
                <Link href="/tools/an-alt-decision-tree">代替テキスト２択チャート</Link>
              </>
            ),
            description:
              'An alt Decision Treeを参考に作られた、画像の代替テキストと呼ばれるalt属性値を決める手助けをする２択チャートです。',
          },
          {
            key: `DOM Event Watcher`,
            title: (
              <>
                <Link href="/tools/dom-events-watcher/">DOM Event Watcher</Link>
              </>
            ),
            description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
          },
          {
            key: `Playground: Accessible Name and Description Computation`,
            title: (
              <>
                <Link href="/tools/accessible-name-and-description-computation">
                  Playground: Accessible Name and Description Computation
                </Link>
              </>
            ),
            description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
          },
        ]}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: "ツール集",
  description: '作ったものをまとめている階層です。',
  twitter: {
    card: 'summary_large_image',
    title: 'ツール集',
    description: '作ったものをまとめている階層です。',
  },
};
