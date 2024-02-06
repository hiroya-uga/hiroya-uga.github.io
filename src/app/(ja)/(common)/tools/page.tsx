import { SimpleDescriptionList } from '@/components/List';

import { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1 className="mb-0">ツール集</h1>
      <p className="mb-12">作ったものをまとめている階層です。</p>

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
        ]}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: 'ツール集',
  description: '作ったものをまとめている階層です。',
};
