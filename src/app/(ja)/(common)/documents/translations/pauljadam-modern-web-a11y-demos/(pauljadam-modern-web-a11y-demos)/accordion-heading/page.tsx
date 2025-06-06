import { ButtonInH2 } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/accordion-heading/Client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/accordion-heading');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <h2>
        <ButtonInH2 />
      </h2>

      <div id="accordion-div" style={{ display: 'none' }}>
        表示されたコンテンツ
      </div>
    </>
  );
}
