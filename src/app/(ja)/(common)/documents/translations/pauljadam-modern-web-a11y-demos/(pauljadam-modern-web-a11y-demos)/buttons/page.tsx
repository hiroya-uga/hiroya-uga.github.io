import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/buttons/buttons.css';
import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/buttons/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/buttons');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <ul>
        <li>
          <input type="button" className="primary" value="優先度高" />
        </li>
        <li>
          <input type="button" className="secondary" value="通常ボタン" />
        </li>
        <li>
          <input type="button" className="info" value="お知らせボタン" />
        </li>
        <li>
          <input type="button" className="help" value="ヘルプボタン" />
        </li>
        <li>
          <input type="button" className="danger" value="重要なボタン" />
        </li>
      </ul>
    </>
  );
}
