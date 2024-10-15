import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/dialog/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/dialog/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "アクセシブルなモーダルダイアログ - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
});

export default function Page() {
  return (
    <>
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
    </>
  );
}
