import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/dialog/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/dialog/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'アクセシブルなモーダルダイアログ',
  description: 'Web開発者の物置。',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

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
