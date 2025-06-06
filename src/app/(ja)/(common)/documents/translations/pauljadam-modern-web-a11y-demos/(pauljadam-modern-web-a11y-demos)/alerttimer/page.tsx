import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/alerttimer/DocumentScript';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/alerttimer');

export default function Page() {
  return (
    <>
      <h1>
        WAI-ARIAの<code>role="alert"</code>と<code>setTimeout</code>
      </h1>

      <DocumentScript />

      <span tabIndex={0}>ここにはタブフォーカスが当たります。６秒後にアラート文が自動的に読み上げられます。</span>
      <div id="alert-div" role="alert"></div>
    </>
  );
}
