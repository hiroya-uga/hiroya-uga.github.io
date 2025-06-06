import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/csunmobile/accordion-bad/DocumentScript';
import { getMetadata } from '@/utils/seo';

import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/csunmobile/accordion-bad/page.css';

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

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile/accordion-bad');
