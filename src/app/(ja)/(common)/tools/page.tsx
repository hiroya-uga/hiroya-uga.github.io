import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ツール集',
  description: '作ったものをまとめている階層です。',
  twitter: {
    card: 'summary_large_image',
    title: 'ツール集',
    description: '作ったものをまとめている階層です。',
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
            key: `文字数カウント`,
            title: (
              <>
                <Link href="/tools/character-count">文字数カウント</Link>
              </>
            ),
            description: '文章の文字数をカウントするツールです。原稿用紙換算、段落数も確認できます。',
          },
        ]}
      />

      <h2>Playground</h2>

      <SimpleDescriptionList
        list={[
          {
            key: `Accessible Name and Description Computation Playground`,
            title: (
              <>
                <Link href="/tools/accessible-name-and-description-computation">
                  Accessible Name and Description Computation Playground
                </Link>
              </>
            ),
            description: 'アクセシブルな名前および説明がどう計算されるかをテストするためのページです。',
          },
          {
            key: `CSS Units Playground`,
            title: (
              <>
                <Link href="/tools/css-units">CSS Units Playground</Link>
              </>
            ),
            description: 'それぞれのCSSの単位が、実際にはどのようなCSSピクセルになるのかを確認できるページです。',
          },
          {
            key: `DOM Event Playground`,
            title: (
              <>
                <Link href="/tools/dom-events-watcher/">DOM Event Playground</Link>
              </>
            ),
            description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
          },
          {
            key: `TouchEvent.touches Playground`,
            title: (
              <>
                <Link href="/tools/touch-event-touches">TouchEvent.touches Playground</Link>
              </>
            ),
            description: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
          },
        ]}
      />
    </>
  );
}
