import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/ariacountdown/DocumentScript';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/ariacountdown');

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
