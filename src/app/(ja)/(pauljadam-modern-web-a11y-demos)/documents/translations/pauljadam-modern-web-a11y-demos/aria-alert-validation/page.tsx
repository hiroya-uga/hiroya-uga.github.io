import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-alert-validation/DocumentScript';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'ARIA Live Regionsまたはrole="alert"を使用してエラーを特定する - PaulJAdam\'s Modern Web Accessibility Demos',
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title:
      'ARIA Live Regionsまたはrole="alert"を使用してエラーを特定する - PaulJAdam\'s Modern Web Accessibility Demos',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
};

export default function Page() {
  return (
    <>
      <h1>
        ARIA Live Regionsまたは<code>role="alert"</code>を使用してエラーを特定する
      </h1>

      <DocumentScript />

      <h2>ユーザエージェントについて</h2>

      <h3>対象環境</h3>

      <ul>
        <li>OS X 10.8.4 + Safari + VoiceOver</li>
        <li>iOS 6 &amp; 7 + Mobile Safari + VoiceOver</li>
        <li>Windows 7 + Firefox 20 + NVDA 2013.1</li>
        <li>Windows 7 + Firefox 20 + JAWS 14</li>
        <li>Windows 7 + IE 8 + JAWS 14 (aria-live=assertive ONLY)</li>
        <li>Windows 7 + IE 7 + JAWS 14 (aria-live=assertive ONLY)</li>
      </ul>

      <h3>対応していない環境</h3>

      <ul>
        <li>Windows 7 + IE 8 + NVDA 2013.1 (NO support)</li>
      </ul>

      <h3>Support Notes</h3>

      <p>
        JAWSおよびNVDAでFirefoxを使用している場合、<code>role="alert"</code>は "Alert"としてアナウンスされ、
        <code>aria-live="assertive"</code>はその追加テキストを含みません。なお、
        <strong>NVDA 2013.1 + IE 8のサポートはありません</strong>。エラーコンテナーで<code>role="alert"</code>と
        <code>aria-live="assertive"</code>を<em>両方とも</em>
        使用することで、一覧にあるすべての組み合わせで機能し、より広いUA/ATの組み合わせをサポートすることができます。
      </p>
      <p>
        ページ内にアラートや、変更が即座に伝達されるライブリージョンを表示する方法はいくつかありますが、エラーコンテナの作成方法やエラーメッセージの挿入方法によって、「IE
        8 + JAWS 14」や「VoiceOver +
        Safari」などのより難しいブラウザとスクリーンリーダーの組み合わせでも機能するかどうかが決まります。
      </p>

      <h2>適用範囲</h2>

      <p>このテクニックはWAI-ARIAを使ったHTMLに適用されます。</p>

      <p>この技法は達成基準（SC）3.3.1に関連します。（エラー識別）：</p>

      <ul>
        <li>
          <a href="http://www.w3.org/TR/UNDERSTANDING-WCAG20/minimize-error-identified.html">Understanding SC 3.3.1</a>
          （日本語訳：
          <a href="https://waic.jp/docs/UNDERSTANDING-WCAG20/minimize-error-identified.html">
            達成基準 3.3.1 を理解する
          </a>
          ）
        </li>
        <li>
          <a href="http://www.w3.org/WAI/WCAG20/quickref/#qr-minimize-error-identified"> How to meet SC 3.3.1</a>
          （日本語訳：
          <a href="https://waic.jp/docs/WCAG20/quickref/#qr-minimize-error-identified">How to meet 達成基準 3.3.1</a>）
        </li>
      </ul>

      <h2>解説</h2>

      <p>
        この達成方法の目的は、入力エラーが発生した場合にスクリーンリーダーなどの支援技術 (AT) に通知することです。
        <code>aria-live</code>
        属性を付与することで、その要素の配下はライブリージョンとなり、エラーメッセージが出力された際に AT
        がユーザにそれを通知できるようになります。<code>aria-live</code>
        領域内部のコンテンツは、テキストが表示されている場所に AT がフォーカスしていなくとも自動的に読みあげられます。
      </p>

      <p>
        すべての例でページロード時にDOMに存在している、エラーメッセージを出力するための空の要素（以下、エラーコンテナ）があります。これらは
        <code>aria-atomic="true"</code>を持ち、<code>aria-live</code>属性または<code>role="alert"</code>を持ちます。
      </p>

      <p>
        ライブリージョンのプロパティを直接適用する代わりに使用できる
        <a href="https://www.w3.org/WAI/PF/aria-practices/#chobet">特殊ケースのライブリージョンのロール</a>
        も多数あります。
      </p>

      <h2>実装例</h2>

      <p>
        次の例では、<code>role="alert"</code>を使用します。これは、<code>aria-live="assertive"</code>
        を使用するのと同等です。
      </p>

      <p>
        この例ではページロード時にDOMに存在している、エラーメッセージを出力するための空の要素（以下、エラーコンテナ）があります。これらは
        <code>aria-atomic="true"</code>を持ち、<code>aria-live</code>属性または<code>role="alert"</code>を持ちます。
      </p>

      <p>
        ほとんどのスクリーンリーダーがエラーメッセージを読み上げるには、エラーコンテナがページロード時にDOMに存在する必要があります。aria-atomic="true"は、エラーがある状態で送信ボタンが複数回押された後にもiOS上のVoiceOverにエラーメッセージを読み取らせるために必要です。
      </p>

      <p>
        このサンプルでは送信ボタン押下時に、JavaScriptがテキストフィールドの値が空かどうかを確認し、空の場合はライブリージョンであるエラーコンテナにエラーメッセージを挿入します。新たに送信が試みられるたびに、前のエラーメッセージがエラーコンテナから削除され、新しいエラーメッセージが挿入されます。
      </p>

      <h3>
        DOMにすでに存在する<code>role="alert"</code>でエラーメッセージをコンテナに注入する
      </h3>

      <form name="signup" id="signup" method="post" action="">
        <p id="errors" role="alert" aria-atomic="true"></p>
        <p>
          <label htmlFor="last">姓（必須）</label>
          <br />
          <input type="text" name="last" id="last" />
        </p>
        <p>
          <label htmlFor="first">名（必須）</label>
          <br />
          <input type="text" name="first" id="first" />
        </p>
        <p>
          <label htmlFor="email">メールアドレス（必須）</label>
          <br />
          <input type="text" name="email" id="email" />
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>
    </>
  );
}
