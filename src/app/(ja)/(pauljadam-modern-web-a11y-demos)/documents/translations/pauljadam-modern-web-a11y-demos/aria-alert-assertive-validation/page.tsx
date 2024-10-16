import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-alert-assertive-validation/DocumentScript';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata(
  '/documents/translations/pauljadam-modern-web-a11y-demos/aria-alert-assertive-validation',
);

export default function Page() {
  return (
    <>
      <h1>
        WAI-ARIAのみを使用した簡易的なフォーム検証（<code>role=alert</code>、<code>aria-live=assertive</code>）
      </h1>

      <DocumentScript />

      <p>
        これらの実装サンプルは、W3C・WCAG WG・ARIA達成方法集に基づいています（
        <a href="http://www.w3.org/WAI/GL/wiki/Using_ARIA_Live_Regions_or_role=alert_to_Identify_Errors">
          Using ARIA Live Regions or role=alert to Identify Errors
        </a>
        ）。ブラウザや支援技術のサポート差異を確認するために3つのサンプルを用意しました。
      </p>

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
        ほとんどのスクリーンリーダーがエラーメッセージを読み上げるには、エラーコンテナがページロード時にDOMに存在する必要があります。
        <code>aria-atomic="true"</code>
        は、エラーがある状態で送信ボタンが複数回押された後にもiOS上のVoiceOverにエラーメッセージを読み取らせるために必要です。このサンプルでは送信ボタン押下時に、JavaScriptがテキストフィールドの値が空かどうかを確認し、空の場合はライブリージョンであるエラーコンテナにエラーメッセージを挿入します。新たに送信が試みられるたびに、前のエラーメッセージがエラーコンテナから削除され、新しいエラーメッセージが挿入されます。
      </p>

      <h2>OS/UA/AT Support</h2>

      <ul>
        <li>OS X 10.8.4 + Safari + VoiceOver</li>
        <li>iOS 6 &amp; 7 + Mobile Safari + VoiceOver</li>
        <li>Windows 7 + Firefox 20 + NVDA 2013.1</li>
        <li> Windows 7 + Firefox 20 + JAWS 14</li>
        <li>
          Windows 7 + IE 8 + JAWS 14 (<code>aria-live="assertive"</code> ONLY)
        </li>
        <li>
          Windows 7 + IE 7 + JAWS 14 (<code>aria-live="assertive"</code> ONLY)
        </li>
      </ul>

      <h3>Support Notes</h3>

      <p>
        JAWSおよびNVDAでFirefoxを使用している場合、<code>role="alert"</code>は "Alert"としてアナウンスされ、
        <code>aria-live="assertive"</code>はその追加テキストを含みません。なお、
        <strong>NVDA 2013.1 + IE 8のサポートはありません</strong>。
        3番目の例では、一覧にあるすべての組み合わせで機能するより広いUA/ATサポートのために、エラーコンテナーで
        <code>role="alert"</code>と<code>aria-live="assertive"</code>を<em>両方とも</em>使用します。
      </p>

      <p>
        ページ内にアラートや、変更が即座に伝達されるライブリージョンを表示する方法はいくつかありますが、エラーコンテナの作成方法やエラーメッセージの挿入方法によって、「IE
        8 + JAWS 14」や「VoiceOver +
        Safari」などのより難しいブラウザとスクリーンリーダーの組み合わせでも機能するかどうかが決まります。UA /
        ATサポートの問題についての詳細は
        <a href="http://blog.paciellogroup.com/2012/06/html5-accessibility-chops-aria-rolealert-browser-support/">
          HTML5 Accessibility Chops: ARIA role=alert browser support
        </a>
        をご覧ください。
      </p>

      <h2>
        DOMにすでに存在する<code>role="alert"</code>を持つエラーコンテナにエラーメッセージを出力する
      </h2>

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

      <h2>
        DOMにすでに存在する<code>aria-live="assertive"</code>を持つエラーコンテナにエラーメッセージを出力する
      </h2>

      <form name="signup" id="signup2" method="post" action="">
        <p id="errors2" aria-live="assertive" aria-atomic="true"></p>
        <p>
          <label htmlFor="last2">姓（必須）</label>
          <br />
          <input type="text" name="last" id="last2" />
        </p>
        <p>
          <label htmlFor="first2">名（必須）</label>
          <br />
          <input type="text" name="first" id="first2" />
        </p>
        <p>
          <label htmlFor="email2">メールアドレス（必須）</label>
          <br />
          <input type="text" name="email" id="email2" />
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        DOMにすでに存在する<code>role="alert"</code>及び<code>aria-live="assertive"</code>
        両方を持ったエラーコンテナにのエラーメッセージを出力する
      </h2>

      <form name="signup" id="signup3" method="post" action="">
        <p id="errors3" role="alert" aria-live="assertive" aria-atomic="true"></p>
        <p>
          <label htmlFor="last3">姓（必須）</label>
          <br />
          <input type="text" name="last" id="last3" />
        </p>
        <p>
          <label htmlFor="first3">名（必須）</label>
          <br />
          <input type="text" name="first" id="first3" />
        </p>
        <p>
          <label htmlFor="email3">メールアドレス（必須）</label>
          <br />
          <input type="text" name="email" id="email3" />
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>
    </>
  );
}
