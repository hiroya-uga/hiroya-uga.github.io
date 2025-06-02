import Link from 'next/link';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
        <p>入力された値は当サイト側で計測・収集しておりません。</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
          {
            key: `Slack reminder command generator`,
            title: (
              <>
                <Link href="/tools/slack-reminder-command-generator">Slack reminder command generator</Link>
              </>
            ),
            description:
              'Slackのリマインダーコマンドを生成するためのツールです。リマインダーの内容・時間・繰り返しの設定を行うためのコマンドを生成できます。',
          },
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

      <h2 className="mb-4 mt-14 text-xl font-bold sm:mb-6 sm:mt-20 sm:text-2xl">Playground</h2>

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
