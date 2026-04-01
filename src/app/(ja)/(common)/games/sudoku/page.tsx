import { SudokuClient } from '@/app/(ja)/(common)/games/sudoku/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { Heading } from '@/components/Heading';
import { DiscList, NoteList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { Table } from '@/components/Table';
import { DEFAULT_JSON_LD, URL_ORIGIN } from '@/constants/meta';
import { getMetadata } from '@/utils/get-metadata';
import Link from 'next/link';

export const metadata = getMetadata('/games/sudoku');

const jsonLd = {
  ...DEFAULT_JSON_LD,
  '@type': 'Game',
  name: metadata.pageTitle,
  description: metadata.description,
  url: `${URL_ORIGIN}/games/sudoku/`,
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={metadata.pageTitle} description={metadata.description}>
        <div className="mt-paragraph">
          <NoteList
            list={[
              {
                key: '1',
                value: (
                  <span className="block">
                    遊び方についてはページ下部の「<Link href="#anchor-遊び方">遊び方</Link>」をご覧ください。
                  </span>
                ),
              },
            ]}
          />
        </div>
      </PageTitle>
      <div className="@container">
        <SudokuClient />
      </div>

      <Heading level={2} id={'anchor-遊び方'}>
        遊び方
      </Heading>

      <DiscList
        list={[
          '9x9マスのうち、空いているマスに数字を入力してください',
          'マスはクリック（タップ）で選択できます',
          'すでに値が入っている場合も、数字キーを入力すると上書きできます',
          '9行9列、9つの3×3のブロックいずれも、1から9までの数字が1つずつ重複せずに数字が入れられたらゲームクリアです',
          {
            key: 'キーボードの場合は方向キーとEnterキーおよびShift+Enterキーでもマスを移動できます',
            value: (
              <>
                キーボードの場合は方向キーと<kbd>Enter</kbd>キーおよび
                <kbd>
                  <kbd>Shift</kbd>+<kbd>Enter</kbd>
                </kbd>
                キーでもマスを移動できます。
              </>
            ),
          },
        ]}
      />

      <p className="my-paragraph">各種ボタン、スイッチの動作は以下の通りです。</p>

      <Table>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">名称</th>
            <th scope="col">内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">リセット</th>
            <td>現在の問題を最初からやり直せます。</td>
          </tr>
          <tr>
            <th scope="row">正誤確認</th>
            <td>現在入力されている値のうち、間違っている部分を削除します。</td>
          </tr>
          <tr>
            <th scope="row">ギブアップ</th>
            <td>現在の問題をやめて、回答例を確認します。</td>
          </tr>
          <tr>
            <th scope="row">次の問題</th>
            <td>現在の問題をやめて、新しい問題を生成します。</td>
          </tr>
          <tr>
            <th scope="row">ハイライト表示</th>
            <td>マウスオーバー、または入力中に十字のハイライトを表示します。</td>
          </tr>
          <tr>
            <th scope="row">重複ヒント表示</th>
            <td>同じ行、列、9つの3×3のブロック内で重複している値を不正な値としてマークします。</td>
          </tr>
          <tr>
            <th scope="row">進捗率を表示</th>
            <td>入力されている値のうち、何％が成立している値の割合を表示します。</td>
          </tr>
        </tbody>
      </Table>

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink hashtags={['数独']} />
      </p>
    </>
  );
}
