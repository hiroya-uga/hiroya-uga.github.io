import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile-accordion-bad/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile-accordion-bad/page.css';

import type { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1>アコーディオンのアクセシビリティ失敗例</h1>

      <DocumentScript />

      <a
        id="shipping-toggle"
        style={{
          cursor: 'pointer',
          fontWeight: 'bold',
          margin: '20px 0 10px',
          display: 'inline-block',
        }}
      >
        アコーディオンフック <i className="fa fa-plus-square"></i>
      </a>
      <div id="shipping-panel" style={{ display: 'none' }}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "アコーディオンのアクセシビリティ失敗例 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "アコーディオンのアクセシビリティ失敗例 - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
};
