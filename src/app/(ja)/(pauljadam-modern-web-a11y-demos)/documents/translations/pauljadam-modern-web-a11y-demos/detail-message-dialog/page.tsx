import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/detail-message-dialog/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/detail-message-dialog/page.css';
import { getMetadata } from '@/utils/seo';

export default function Page() {
  return (
    <>
      <DocumentScript />

      <h1>WAI-ARIAのrole="alertdialog"属性を使った詳細メッセージダイアログ</h1>
      <p>
        <a href="http://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog">
          http://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog
        </a>
      </p>
      <p>
        <a href="http://www.w3.org/TR/wai-aria-1.1/#alertdialog">http://www.w3.org/TR/wai-aria-1.1/#alertdialog</a>
      </p>
      <button id="trigger-spec">仕様に準拠した警告メッセージを表示</button>
      <br />
      <button id="trigger">仕様に適合していない警告メッセージを表示</button>
    </>
  );
}

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/detail-message-dialog');
