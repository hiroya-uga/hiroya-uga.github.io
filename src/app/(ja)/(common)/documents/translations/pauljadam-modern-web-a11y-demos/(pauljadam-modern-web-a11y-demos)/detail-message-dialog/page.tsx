import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/detail-message-dialog/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/detail-message-dialog/page.module.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/detail-message-dialog');

export default function Page() {
  return (
    <div className={styles.page}>
      <DocumentScript />

      <h1>{metadata.pageTitle}</h1>
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
    </div>
  );
}
