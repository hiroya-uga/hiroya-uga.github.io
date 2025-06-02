import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider/DocumentScript';

import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <p role="alert" id="current-temp">
        現在の気温は摂氏20℃です。
      </p>
      <label htmlFor="temp">温度 </label>
      <input id="temp" type="range" min="-30" defaultValue={20} max="60" />
    </>
  );
}
