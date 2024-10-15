import {
  AccesskeyValuesAsLetters,
  AccesskeyValuesAsNumbers,
} from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/accesskey/Client';
import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/accesskey/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/accesskey/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "アクセスキーのアクセシビリティDEMO - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "アクセスキーのアクセシビリティDEMO - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
});

export default function Page() {
  return (
    <>
      <DocumentScript />
      <h1>{metadata.pageTitle}</h1>
      <h2>数値キーのアクセスキー</h2>
      <AccesskeyValuesAsNumbers />
      <br />
      <b style={{ display: 'inline', fontSize: 'inherit' }}>Accesskeys:</b>
      <button id="show" accessKey="7" aria-label="アクセスキーを表示させる">
        表示する
      </button>{' '}
      <button id="hide" accessKey="8" aria-label="アクセスキーを隠す">
        隠す
      </button>
      <h2>文字キーのアクセスキー</h2>
      <AccesskeyValuesAsLetters />
      <p>
        macOS Safariのユーザは{' '}
        <kbd>
          <kbd>Control</kbd>+<kbd>Option (Alt)</kbd>+ {`{Accesskey}`}
        </kbd>{' '}
        を押してください。
      </p>
      <p>
        ⌃ = <kbd>Control</kbd>、 ⌥ = <kbd>Option</kbd>
      </p>
      <p>
        このサンプルにおいて、Safariでは{' '}
        <strong>
          <kbd>
            <kbd>Control</kbd>+<kbd>Option (Alt)</kbd>+<kbd>7</kbd>
          </kbd>{' '}
          を押下する
        </strong>
        ことでアクセスキーを表示させることができます。 (
        <a href="https://www.w3schools.com/tags/att_global_accesskey.asp">Firefox、Chrome、IEでの場合</a>)。
      </p>
      <p>
        文字キーをアクセスキーに設定してしまうと、他のアプリやスクリーンリーダと競合してしまうため、競合の可能性が少ない１２３４５６７８９０の数字キーを利用するとよいでしょう。
      </p>
      <p>
        例えば、WindowsのChromeでの
        <kbd>
          <kbd>Alt</kbd>+<kbd>D</kbd>
        </kbd>
        は<code>accesskey</code>
        属性で設定された動作ではなく、ブラウザ標準のショートカットキーが優先され、アドレスバーにフォーカスが当たります。
      </p>
      <p>
        試しに、このDEMOページのアクセスキーを「VoiceOverとSafari」、「NVDAとJAWSとFirefox」の組み合わせてテストしたところ競合せず、「NVDAとChrome」の組み合わせでは
        <kbd>
          <kbd>Alt</kbd>+<kbd>D</kbd>
        </kbd>
        のみが競合する結果となりました。
      </p>
      <p>
        アクセスキーの値に「
        <kbd>
          <kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>D</kbd>
        </kbd>
        」や「
        <kbd>
          <kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>C</kbd>
        </kbd>
        」を使用すると、ユーザがインストールしたMagnet for
        macOSのようなアクセスキーがmacOSで機能しないようにするアプリとも競合する可能性があります
      </p>
      <h2>VoiceOverでアクセスキーを使用する</h2>
      <p>
        VoiceOverが実行されているときは、
        <kbd>
          <kbd>Control</kbd>+<kbd>Option</kbd>
        </kbd>
        を同時に押すのではなく、
        <strong>
          <kbd>Control</kbd>だけを押す
        </strong>
        必要があります。
      </p>
      <p>
        <a href="http://html.cita.illinois.edu/nav/accesskey/accesskey-example.php" lang="en-US" accessKey="9">
          iCITA: Access Key Example
        </a>
      </p>
      <h2>Chrome で VoiceOver を使用してアクセスキーを使用する</h2>
      <p>VoiceOverパススルーコマンド（Controlキー、Optionキー、Tabキー）を実行してから、アクセスキーを有効にします。</p>
      <a href="https://www.apple.com/voiceover/info/guide/_1131.html" lang="en-US">
        Tell VoiceOver to ignore the next key combination you press with VO-Tab
      </a>
    </>
  );
}
