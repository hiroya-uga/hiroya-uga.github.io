import { NoteBox } from '@/components/Box';
import { SimpleDescriptionList } from '@/components/List';
import { LinkToOriginal } from '@/components/specific/documents/translations/LinkToOriginal';
import { WEB_SPEC_TRANSLATIONS_NOTE } from '@/components/specific/documents/translations/constants';
import { RelatedResourceBox } from '@/components/specific/documents/translations/w3c/wai';

import type { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1 className="mb-2">日本語訳：Images Tutorial</h1>

      <div className="mb-14 bg-slate-300 p-3 rounded-md">
        <div className="mb-2 text-sm leading-normal sm:text-base sm:leading-relaxed sm:mb-4">
          <LinkToOriginal
            origins={[
              {
                title: 'Images Tutorial | Web Accessibility Initiative (WAI) | W3C',
                href: 'https://www.w3.org/WAI/tutorials/images/',
                lang: 'en',
                hrefLang: 'en',
              },
            ]}
          />
        </div>

        <div className="text-xs leading-normal sm:text-sm">
          <p className="flex gap-1">
            <span>※</span>
            <small>
              <WEB_SPEC_TRANSLATIONS_NOTE />
            </small>
          </p>
        </div>
      </div>

      <p>画像には、画像が表す情報や機能を説明する代替テキストが必要です。</p>
      <p className="mb-12">
        代替テキストがあれば、<a href="#why-is-this-important">さまざまな障害を持つ人々</a>
        も画像から得られる情報が利用できるようになります。このチュートリアルでは、画像の目的に基づいて適切な代替テキストを提供する方法が示されています。
      </p>

      <dl className="mb-12">
        {(
          [
            [
              '意味のある画像 - Informative Images',
              'https://www.w3.org/WAI/tutorials/images/informative/',
              <>
                概念や情報を表現する画像。通常は写真やイラストです。
                <span className="sm:inline-block">
                  代替テキストは少なくとも、画像によって示される情報の要点を伝える簡単な説明であるべきです。
                </span>
              </>,
            ],
            [
              '装飾目的の画像 - Decorative Images',
              'https://www.w3.org/WAI/tutorials/images/decorative/',
              <>
                ページを理解する上で重要な情報を伝えるものではなく、視覚的な装飾を追加することが画像の唯一の目的である場合は、空の代替テキスト（
                <code>alt=""</code>） を提供してください。
              </>,
            ],

            [
              '機能を持つ画像 - Functional Images',
              'https://www.w3.org/WAI/tutorials/images/functional/',
              <>
                リンクまたはボタンとして使用される画像の代替テキストは、視覚的な画像ではなく、リンクまたはボタンの機能を説明する必要があります。
                <span className="sm:inline-block">
                  このような画像の例としては、印刷機能を表すプリンターアイコンや、フォームを送信するボタンなどがあげられます。
                </span>
              </>,
            ],
            [
              '文字画像 - Images of Text',
              'https://www.w3.org/WAI/tutorials/images/textual/',
              <>
                判読可能なテキストが画像内に含まれている場合がありますが、
                <span className="sm:inline-block">ロゴ画像ではない場合は画像内テキストを避けるべきです。</span>
                <span className="sm:inline-block">
                  その上で文字画像を使用する場合、代替テキストには画像と同じ文言が指定する必要があります。
                </span>
              </>,
            ],
            [
              'グラフや図などの複雑な画像 - Complex Images',
              'https://www.w3.org/WAI/tutorials/images/complex/',
              <>
                データや詳細な情報を伝えるために、画像で提供されるデータまたは情報と同等の完全な代替テキストを提供してください。
              </>,
            ],
            [
              '画像のグループ - Groups of Images',
              'https://www.w3.org/WAI/tutorials/images/groups/',
              <>
                複数の画像で1つの情報を伝える場合、1つの画像の代替テキストでグループ全体の情報を伝える必要があります。
              </>,
            ],
            [
              'イメージマップ - Image Maps',
              'https://www.w3.org/WAI/tutorials/images/imagemap/',
              <>
                複数のクリック可能な領域を含む画像の代替テキストは、リンクセットの全体的なコンテキストを提供する必要があります。
                <span className="sm:inline-block">
                  また、個別にクリック可能な領域には、リンクの目的やリンク先を説明する代替テキストが必要です。
                </span>
              </>,
            ],
          ] as const
        ).map(([title, href, description]) => {
          const isW3C = href.startsWith('https://www.w3.org');

          return (
            <div key={href} className="group rounded p-3 -mx-3 focus-within:bg-slate-200">
              <dt className="sm:text-lg mb-1 font-bold">
                <a href={href} hrefLang={isW3C ? 'en' : undefined}>
                  {title}
                  {isW3C && '（外部サイト）'}
                </a>
                {isW3C && <b>※翻訳予定</b>}
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed">{description}</dd>
            </div>
          );
        })}
      </dl>

      <p>
        代替テキストは、画像の用途、コンテキスト、コンテンツに応じて著者が決定する必要があります。
        たとえば、画像内の鳥の正確な種類や見た目の情報は、公園に関するWebサイトでは関連性が低く簡単に説明されるだけかもしれない一方で、鳥に特化したWebサイトでは適切な場合があります。
      </p>
      <p>
        画像それぞれが、どのカテゴリに該当するか決定するための簡単な概要については
        <Link href="/tools/an-alt-decision-tree/">Alt Decision Tree</Link>
        を参照してください。
      </p>

      <h2>
        <span className="target" id="why-is-this-important">
          どうして代替テキストは重要なの？
        </span>
      </h2>

      <p className="mb-8">
        画像やグラフィックは、多くの人々、特に認知障害や学習障害を抱えた方々にとってコンテンツをより快適で理解しやすくします。
        <span className="sm:inline-block">
          弱視の人を含む視覚障害のある方にとってそれらは、Webコンテンツの中で自分がどのあたりを読んでいるか理解するための手がかりとしても役立つからです。
        </span>
      </p>

      <p className="mb-8">
        画像はWebサイトで広く使用されています。そのため、画像がアクセシブルではない場合には大きな障壁となる可能性があります。
        <span className="sm:inline-block">アクセシブルな画像は、次のような多くの状況で有益です。</span>
      </p>

      <div className="mb-8">
        <SimpleDescriptionList
          list={[
            {
              title: 'スクリーンリーダを使用する人々',
              description: '代替テキストは音声で読み上げられたり、点字として表示させたりできます。',
            },
            {
              title: '音声入力ソフトウェアを使用する人々',
              description: 'ユーザは単一の音声コマンドでボタンやリンク付きの画像にフォーカスを当てることができます。',
            },
            { title: '音声対応のWebサイトを閲覧する人々', description: '代替テキストは音声で読み上げられます。' },
            {
              title: 'モバイルのWebユーザ',
              description: '画像をオフにできます。特にデータローミングのために使われます。',
            },
            { title: '検索エンジン最適化（SEO）', description: '画像が検索エンジンでインデックスされやすくなります。' },
          ]}
        />
      </div>

      <NoteBox>
        <p>
          Webサイトから画像を削除すること（いわゆる「テキストのみのバージョン」）は、これらのユーザーや利用状況に対してアクセシビリティや機能の低下につながります。
        </p>
      </NoteBox>

      <RelatedResourceBox>
        <p className="mb-2">
          <b>達成基準：</b>
        </p>

        <SimpleDescriptionList
          list={[
            {
              key: '1.1.1 ノンテキストコンテンツ',
              title: (
                <>
                  <a href="https://waic.jp/translations/WCAG20/quickref/#qr-text-equiv-all">
                    <b>1.1.1</b> 非テキストコンテンツ
                  </a>
                </>
              ),
              description:
                '利用者に提示されるすべての非テキストコンテンツには、同等の目的を果たすテキストによる代替が提供されている。（レベルA）',
            },

            {
              key: '1.4.5 文字画像',
              title: (
                <>
                  <a href="https://waic.jp/translations/WCAG20/quickref/#qr-visual-audio-contrast-text-presentation">
                    <b>1.4.5</b> 文字画像
                  </a>
                </>
              ),
              description:
                '使用している技術で意図した視覚的提示が可能である場合、文字画像ではなくテキストが情報伝達に用いられている。（カスタマイズ可能または必要不可欠な画像を除く）（レベルAA）',
            },

            {
              key: '1.4.9 文字画像 (例外なし)',
              title: (
                <>
                  <a href="https://waic.jp/translations/WCAG20/quickref/#qr-visual-audio-contrast-text-images">
                    <b>1.4.9</b> 文字画像 (例外なし)
                  </a>
                </>
              ),
              description:
                '文字画像は、純粋な装飾に用いられているか、テキストの特定の表現が伝えようとする情報にとって必要不可欠である場合に用いられている。（レベルAAA）',
            },
          ]}
        />
      </RelatedResourceBox>
    </>
  );
}

export const metadata: Metadata = {
  title: '日本語訳：Images Tutorial',
  description: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
};
