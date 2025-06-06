import { Tab } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-hidden/Client';
import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-hidden/DocumentScript';

import '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-hidden/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/aria-hidden');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <p>
        <a href="#">通常のリンクテキストの例</a>
      </p>
      <p>
        <a href="#" aria-hidden="true">
          <code>aria-hidden</code>を持ったリンクテキストの例
        </a>
      </p>
      <p>
        <a href="#">
          通常のリンクテキスト
          <span aria-hidden="true">
            に<code>aria-hidden</code>を持つ<code>span</code>要素を含む
          </span>
          の例
        </a>
      </p>

      <p aria-hidden="true">
        <a href="#">
          <code>aria-hidden</code>を持った<code>p</code>要素内のリンクテキストの例
        </a>
      </p>

      <h2>隠し文字を持つタブ</h2>

      <p>
        <small>※ 動作はしません</small>
      </p>

      <div role="tablist">
        <span role="tab" aria-selected="false">
          <a href="#">タブ1</a>
        </span>
        <span role="tab" aria-selected="true">
          <a href="#">
            <span className="hidden" aria-hidden="true">
              選択された
            </span>
            タブ2
          </a>
        </span>
        <span role="tab" aria-selected="false">
          <a href="#">タブ3</a>
        </span>
      </div>
      <div role="tablist" style={{ margin: '0 0 100px' }}>
        <a aria-selected="false" role="tab" href="#">
          タブ1
        </a>
        <a aria-selected="true" role="tab" href="#">
          <span className="hidden" aria-hidden="true">
            選択された
          </span>
          タブ2
        </a>
        <a aria-selected="false" role="tab" href="#">
          タブ3
        </a>
      </div>

      <Tab />
    </>
  );
}
