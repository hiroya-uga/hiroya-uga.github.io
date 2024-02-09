import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-labelledby/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: "aria-labelledby属性のアクセシビリティデモ - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>
      <h2>問題</h2>
      <fieldset>
        <legend>「天気」「転機」「転記」を使って文章を完成させなさい。</legend>
        <label htmlFor="adam" id="adam-label">
          アダムとヴィンスは紙の資料に書かれた気象情報を
        </label>
        <input id="adam" type="text" aria-labelledby="adam-label adam adam-span" />
        <span id="adam-span">するアルバイトをしていました。</span>
        <label htmlFor="judy" id="judy-label">
          彼らの姉ジュディが紹介してくれた仕事で、二人にとってはまさにこれが
        </label>
        <input id="judy" type="text" aria-labelledby="judy-label judy judy-span judy-label2 judy2 judy-span2" />
        <span id="judy-span">でした。</span>
        <label htmlFor="judy2" id="judy-label2">
          二人はこれがきっかけで、後に
        </label>
        <input id="judy2" type="text" aria-labelledby="judy-label judy judy-span judy-label2 judy2 judy-span2" />
        <span id="judy-span2">予報士として活躍することになります。</span>
      </fieldset>
      <h2>表示ラベル付きの静的 (機能しない) メニューボタン</h2>
      <span id="menu-button-label">チャプター選択: </span>
      <button id="menu-button" aria-labelledby="menu-button-label menu-button" aria-haspopup="menu">
        2. 関数とグラフ <span aria-hidden="true">↓</span>
      </button>
      <h2>checkbox と input</h2>
      <input type="checkbox" id="check1" aria-labelledby="label1 text1" />
      <label htmlFor="check1" id="label1">
        課題ごとの受験回数の制限数は
      </label>{' '}
      <input size={4} type="text" id="text1" aria-labelledby="label1" />
      <br />
      <input type="checkbox" id="check2" aria-labelledby="label2 text2 label3" />
      <label htmlFor="check2" id="label2">
        制限時間は
      </label>{' '}
      <input type="text" id="text2" size={4} aria-labelledby="label2 text2 label3" /> <label id="label3">分です</label>
      <h2>xボタンつきのダイアログのaria-labelledby</h2>
      <div
        style={{ width: '350px' }}
        role="dialog"
        aria-labelledby="dialog-heading"
        aria-describedby="dialog-description"
      >
        <h1 id="dialog-heading">ここにタイトルテキスト</h1>
        <p id="dialog-description">ここに説明文</p>
        <button
          id="dialog-close"
          aria-label="閉じる"
          aria-labelledby="dialog-close dialog-heading"
          style={{ float: 'right', position: 'relative', top: '-4em' }}
        >
          X
        </button>
      </div>
    </>
  );
}
