import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/dialog/DocumentScript';

import { getMetadata } from '@/utils/seo';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/dialog/page.module.css';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/dialog');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <p>
        コーディング手順はこちら：
        <a href="http://w3c.github.io/aria-practices/#dialog_modal" hrefLang="en-US">
          http://w3c.github.io/aria-practices/#dialog_modal
        </a>
      </p>
      <h2>WAI-ARIA role=dialog</h2>
      <button id="trigger-modal">モーダルダイアログを開く</button>
    </div>
  );
}
