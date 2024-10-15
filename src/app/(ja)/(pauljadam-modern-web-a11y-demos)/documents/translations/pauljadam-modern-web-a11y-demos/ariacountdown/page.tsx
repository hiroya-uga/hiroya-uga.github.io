import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/ariacountdown/DocumentScript';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "ARIAを使ったカウントダウンタイマー - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "ARIAを使ったカウントダウンタイマー - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
});

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <p>HH:MM:SS</p>
      <p>ARIA Live Regionsを使って、毎分の変化を読み上げさせる例です。</p>

      <h2>保存までの残り時間:</h2>

      <span id="timer" data-seconds="32400" className="countdown">
        09:00:00
      </span>
      <div
        id="alert"
        role="alert"
        aria-live="assertive"
        style={{ position: 'absolute', width: 0, height: 0, clip: 'rect(0,0,0,0)' }}
      ></div>
    </>
  );
}
