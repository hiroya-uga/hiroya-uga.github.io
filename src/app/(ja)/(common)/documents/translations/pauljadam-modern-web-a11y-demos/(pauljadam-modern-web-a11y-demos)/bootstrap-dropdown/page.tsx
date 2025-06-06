import Script from 'next/script';

import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/bootstrap-dropdown/DocumentScript';
import { getMetadata } from '@/utils/seo';

import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/bootstrap-dropdown/page.css';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/bootstrap-dropdown');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
      <Script src="https://code.jquery.com/jquery.js" />
      <Script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" />

      <div className="dropdown">
        <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
          Dropdown Example
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <a href="#">HTML</a>
          </li>
          <li>
            <a href="#">CSS</a>
          </li>
          <li>
            <a href="#">JavaScript</a>
          </li>
        </ul>
      </div>
    </>
  );
}
