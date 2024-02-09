import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-atomic-relevant/DocumentScript';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: "aria-liveリージョン内のaria-atomicとaria-relevant - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
};

export default function Page() {
  return (
    <>
      <h1>
        <code>aria-live</code>リージョン内の<code>aria-atomic</code>と<code>aria-relevant</code>
      </h1>

      <DocumentScript />

      <h2>解説</h2>
      <p>
        これはテキストフィールドに280文字以下の入力制限があることをスクリーンリーダー利用者に伝えるデモです。たとえば、Twitterの文字数制限のようなものを想定しています。
      </p>

      <p>
        テキストを入力すると残り文字数が更新されます。WAI-ARIAのLive
        Regionsを利用すると、残りの入力可能文字数が変化するたびに値が読み上げられるため、スクリーンリーダー利用者にも伝わります。このテストケースではデフォルトを使用してから、
        <code>aria-atomic</code>および<code>aria-relevant</code>属性を使用してLive
        Regionsの高度なオプションを調査してみます。
      </p>

      <h3>対象環境</h3>

      <ul>
        <li>OS X 10.9.3 + Safari + VoiceOver</li>
        <li>
          iOS 7 + Mobile Safari + VoiceOver <br />（<code>aria-live="assertive"</code> のみサポート）
        </li>
        <li>Windows 7 + Firefox 29.0.1 + NVDA 2014.2</li>
        <li>
          Windows 7 + IE 8 + NVDA 2014.2 <br />（<code>aria-relevant</code> 非対応）
        </li>
        <li>Windows 7 + IE 8 + JAWS 14</li>
        <li>
          Android 4.4.2 + Chrome 34.01847.114 + TalkBack 3.5.1 <br />
          （announces full live region only）
        </li>
        <li>
          Android 4.4.2 + Firefox 29.0.1 + TalkBack 3.5.1 <br />（<code>aria-atomic="true"</code> および{' '}
          <code>aria-relevant</code> 非対応）
        </li>
      </ul>

      <h3>Support Notes</h3>

      <p>
        VoiceOver for OS Xでは期待通りに動作します。 例えば、<code>aria-relevant="additions"</code>は、
        <code>aria-atomic="true"</code>のライブリージョン全体がアナウンスされるのを防ぎます。
      </p>

      <p>
        NVDA + FirefoxおよびJAWS + IEは<code>aria-relevant="additions"</code>を解釈せず、<code>aria-atomic="true"</code>
        を上書きせず、ライブリージョン全体を読み上げます。
      </p>

      <p>
        iOSのVoiceOverでは、即座に読み上げられる<code>aria-live="assertive"</code>でのみ動作します(・︵・)。
      </p>

      <p>
        iOSのVoiceOverは<code>aria-relevant="additions"</code>が<code>aria-atomic="true"</code>を上書きしませんが、OS
        XのVoiceOverでは正しく動作します。
      </p>

      <p>
        <strong>Windows 7 + Firefox 29.0.1 + JAWS 14 はバグだらけ</strong>
        です。イベントが発生するたびに、ライブリージョンではなくテキストフィールド用のアクセシブルネーム全体を読み上げます。
      </p>

      <p>
        Android 4.4.2 + Chrome 34.01847.114 + TalkBack 3.5.1は<code>aria-atomic</code>または<code>aria-relevant</code>
        を解釈しません。TalBackはイベントが発生するたびにライブリージョン全体を読み上げます。
      </p>

      <h2>Notes</h2>

      <p>
        <code>aria-relevant</code>属性のデフォルト値は「additions
        text」ですから、初期値ではノードの削除は関連性を持たないと判断されます。
      </p>

      <p>
        Android版のFirefoxでは、ユーザの入力時にchangeイベント、keyupイベントが走らないため、
        <em>デバイスに依存しない</em>
        inputイベントを使用する必要があります。IE8以下はinputイベントをサポートしていないため、IE9以上にだけをサポートするわけではない場合、onpropertychangeイベントを利用しなければなりません(・◡・)。
      </p>

      <h2>
        「残りの文字数」に<code>aria-live="polite"</code>のみを使用した例
      </h2>

      <form name="contact" id="contact" method="post" action="">
        <p>
          <label htmlFor="name">お名前 *</label>
          <br />
          <input type="text" name="name" id="name" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message">本文 *</label>
          <br />
          <textarea name="message" id="message" aria-describedby="input-info" aria-required="true"></textarea>
          <br />
          <span id="input-info" aria-live="polite">
            残りの文字数: <span id="chars">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="polite"</code>および<code>aria-atomic="false"</code>を使用した例
      </h2>

      <form name="contact" id="contact2" method="post" action="">
        <p>
          <label htmlFor="name2">お名前 *</label>
          <br />
          <input type="text" name="name" id="name2" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email2">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email2" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message2">本文 *</label>
          <br />
          <textarea name="message" id="message2" aria-describedby="input-info2" aria-required="true"></textarea>
          <br />
          <span id="input-info2" aria-live="polite" aria-atomic="false">
            残りの文字数: <span id="chars2">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="polite"</code>および<code>aria-atomic="true"</code>を使用した例
      </h2>

      <form name="contact" id="contact3" method="post" action="">
        <p>
          <label htmlFor="name3">お名前 *</label>
          <br />
          <input type="text" name="name" id="name3" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email3">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email3" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message3">本文 *</label>
          <br />
          <textarea name="message" id="message3" aria-describedby="input-info3" aria-required="true"></textarea>
          <br />
          <span id="input-info3" aria-live="polite" aria-atomic="true">
            残りの文字数: <span id="chars3">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="polite"</code>、<code>aria-atomic="true"</code>および
        <code>aria-relevant="additions"</code>を使用した例
      </h2>

      <form name="contact" id="contact4" method="post" action="">
        <p>
          <label htmlFor="name4">お名前 *</label>
          <br />
          <input type="text" name="name" id="name4" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email4">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email4" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message4">本文 *</label>
          <br />
          <textarea name="message" id="message4" aria-describedby="input-info4" aria-required="true"></textarea>
          <br />
          <span id="input-info4" aria-live="polite" aria-atomic="true" aria-relevant="additions">
            残りの文字数: <span id="chars4">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="assertive"</code>のみを使用した例
      </h2>

      <form name="contact" id="contact5" method="post" action="">
        <p>
          <label htmlFor="name5">お名前 *</label>
          <br />
          <input type="text" name="name" id="name5" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email5">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email5" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message5">本文 *</label>
          <br />
          <textarea name="message" id="message5" aria-describedby="input-info5" aria-required="true"></textarea>
          <br />
          <span id="input-info5" aria-live="assertive">
            残りの文字数: <span id="chars5">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="assertive"</code>、<code>aria-atomic="true"</code>および
        <code>aria-relevant="additions"</code>を使用した例
      </h2>

      <form name="contact" id="contact6" method="post" action="">
        <p>
          <label htmlFor="name6">お名前 *</label>
          <br />
          <input type="text" name="name" id="name6" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email6">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email6" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message6">本文 *</label>
          <br />
          <textarea name="message" id="message6" aria-describedby="input-info6" aria-required="true"></textarea>
          <br />
          <span id="input-info6" aria-live="assertive" aria-atomic="true" aria-relevant="additions">
            残りの文字数: <span id="chars6">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>

      <h2>
        「残りの文字数」に<code>aria-live="polite"</code>を使用し、残り入力可能文字数が25%を切った時に
        <code>polite</code>から<code>assertive</code>に切り替わる例
      </h2>

      <form name="contact" id="contact7" method="post" action="">
        <p>
          <label htmlFor="name7">お名前 *</label>
          <br />
          <input type="text" name="name" id="name7" aria-required="true" />
        </p>
        <p>
          <label htmlFor="email7">メールアドレス *</label>
          <br />
          <input type="email" name="email" id="email7" aria-required="true" />
        </p>
        <p>
          <label htmlFor="message7">本文 *</label>
          <br />
          <textarea name="message" id="message7" aria-describedby="input-info7" aria-required="true"></textarea>
          <br />
          <span id="input-info7" aria-live="polite">
            残りの文字数: <span id="chars7">280</span>
          </span>
        </p>
        <p>
          <input type="submit" name="button" id="button" value="送信" />
        </p>
      </form>
    </>
  );
}
