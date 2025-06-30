import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/csunmobile/accordion-aria/DocumentScript';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata(
  '/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile/accordion-aria',
);

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
      {/* <!-- script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script --> */}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"></link>

      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <button id="shipping-toggle" aria-expanded="false" style={{ fontWeight: 'bold', margin: '20px 0 10px' }}>
        Shipping &amp; Returns <i className="fa fa-plus-square" aria-hidden="true"></i>
      </button>
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
      </div>
    </>
  );
}
