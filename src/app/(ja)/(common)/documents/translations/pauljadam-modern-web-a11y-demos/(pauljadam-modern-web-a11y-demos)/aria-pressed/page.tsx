import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-pressed/DocumentScript';

import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-pressed/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/aria-pressed');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>
      <DocumentScript />
      <p>
        <strong>※ macOS10.13.6では正常に作動しているようです（2019/03/04）</strong>
      </p>
      <p>
        <a href="#" aria-pressed="true" role="button">
          表示する
        </a>{' '}
        <code>a[role="button"][aria-pressed="true"]</code>
      </p>
      <p>
        <a href="#" aria-pressed="true">
          表示する
        </a>{' '}
        <code>a[aria-pressed="true"]</code>
        <sup>※1</sup>
      </p>
      <p>
        <button aria-pressed="true">表示する</button> <code>button[aria-pressed="true"]</code>
      </p>
      <button role="button" aria-pressed="false" id="toggleBtn">
        編集モード
      </button>{' '}
      <code>
        button[role="button"][aria-pressed="<span id="pressed-state">false</span>"]
      </code>
      <p>
        <small>※1 誤った実装</small>
      </p>
    </>
  );
}
