import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-live-slider/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'alertロールを利用したライブスライダー',
  description: 'Web開発者の物置。',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

      <DocumentScript />

      <p role="alert" id="current-temp">
        現在の気温は摂氏20℃です。
      </p>
      <label htmlFor="temp">温度 </label>
      <input id="temp" type="range" min="-30" defaultValue={20} max="60" />
    </>
  );
}
