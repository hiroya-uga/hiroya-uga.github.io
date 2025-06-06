import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/css4altgeneratedcontent/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/css4altgeneratedcontent');

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <h1>{metadata.pageTitle}</h1>

      <p>
        Font
        Awesomeのfa-external-linkアイコンは新しいタブでページが開かれることを表すために利用されます。視覚障害者は視覚的なアイコンを見ることができないため、代替テキストが必要です。「CSS4
        alt for generated content」の仕様はiOS 9 and OS X
        10.11において動作するようです。意図した代替テキストを提供することを確認しました。{' '}
      </p>

      <p>
        Font Awesomeの別窓アイコン：
        <a href="https://www.google.com" target="_blank">
          Google
        </a>
      </p>
      <p>
        Font Awesomeの別窓アイコンと「New」の絵文字：
        <a href="https://www.apple.com" target="_blank" className="new">
          Apple
        </a>
      </p>
      <p>
        通常リンク：<a href="https://www.PaulJAdam.com">PaulJAdam.com</a>
      </p>
      <p>
        装飾的な絵文字と空の代替テキスト：{' '}
        <a href="https://www.PaulJAdam.com/contact.php" className="decorativealtnull">
          お問い合わせ
        </a>
        <br />
        iOSのVoiceOverは「お問い合わせ さるの顔」と読み上げました。
      </p>
      <p>
        装飾的な絵文字と代替テキストに1つの半角スペースを持つ例：{' '}
        <a href="https://www.PaulJAdam.com/contact.php" className="decorativealtnullspace">
          お問い合わせ
        </a>
        <br />
        iOSのVoiceOverは「お問い合わせ」と読み上げました。
      </p>
      <p>
        CSS代替テキストなしのFont Awesomeのアイコン：{' '}
        <a href="https://www.PaulJAdam.com" className="iconnoalt">
          PaulJAdam.com
        </a>
      </p>
      <p>
        CSS代替テキストに半角スペースを指定したFont Awesomeのアイコン：{' '}
        <a href="https://www.PaulJAdam.com" className="iconnullalt" title="新しいタブで開きます">
          PaulJAdam.com
        </a>
      </p>
    </>
  );
}
