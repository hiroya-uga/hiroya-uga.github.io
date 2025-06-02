import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/fake-button/DocumentScript';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/fake-button');

export default function Page() {
  return (
    <>
      <DocumentScript />

      <h1>
        {metadata.pageTitle}
        <a href="https://api.jquery.com/focus/"></a>
      </h1>
      <div role="button" tabIndex={0} id="faux-button">
        フェイクボタン
      </div>
      {/* @ts-ignore */}
      <div role="button" tabIndex={0} id="alt-button" alt="div element with alt">
        <code>alt</code>属性を持つ<code>div</code>要素
      </div>
      <div role="button" tabIndex={0} id="title-button" title="div element with title">
        <code>title</code>属性を持つ<code>div</code>要素
      </div>
    </>
  );
}
