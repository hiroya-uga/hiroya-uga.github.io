import { ButtonInH2 } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/accordion-heading/Client';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: "見出しがアコーディオンのフックの例 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "見出しがアコーディオンのフックの例 - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

      <h2>
        <ButtonInH2 />
      </h2>

      <div id="accordion-div" style={{ display: 'none' }}>
        表示されたコンテンツ
      </div>
    </>
  );
}
