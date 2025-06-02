import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window/DocumentScript';

import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window');

export default function Page() {
  return (
    <>
      {/* <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" /> */}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <DocumentScript />

      <h1>
        新しいウィンドウへのリンクであることを伝えるための、BootstrapのCSSとFont Awesome Icons、JavaScriptによる
        <code>title</code>
        属性付与
      </h1>

      <h2>
        BootstrapやFont Awesome FrameworksによるCSS由来の別窓アイコンおよび、JavaScriptで
        <code>title</code>
        属性値に別窓で開くことを知らせるための説明テキストを設定する例
      </h2>

      <p>
        14/7/21 更新: このデモでは、<code>title</code>
        属性が代替テキストとして機能しているため、アイコンフォントをVoiceOverに読み上げさせないために「CSS4
        alt」を設定しています。<code>title</code>属性ではなく、<code>alt</code>
        プロパティが利用されている新しいDEMOをご覧ください。
        <br />→ <a href="./css4altgeneratedcontent">CSS4 Alt text for Generated Content</a>.
      </p>

      <div id="gnw">
        <h3>Bootstrap glyphicon-new-window</h3>
        <p>
          <a href="https://google.com" target="_blank">
            Google
          </a>
        </p>
        <p>
          <a href="https://apple.com">Apple</a>
        </p>
        <p>
          <a href="https://yahoo.com" target="_blank">
            Yahoo
          </a>
        </p>
      </div>
      <div id="gmw">
        <h3>Bootstrap glyphicon-modal-window</h3>
        <p>
          <a href="https://google.com" target="_blank">
            Google
          </a>
        </p>
        <p>
          <a href="https://apple.com">Apple</a>
        </p>
        <p>
          <a href="https://yahoo.com" target="_blank">
            Yahoo
          </a>
        </p>
      </div>
      <div id="fels">
        <h3>Font Awesome fa-external-link-square</h3>
        <p>
          <a href="https://google.com" target="_blank">
            Google
          </a>
        </p>
        <p>
          <a href="https://apple.com">Apple</a>
        </p>
        <p>
          <a href="https://yahoo.com" target="_blank">
            Yahoo
          </a>
        </p>
      </div>
      <div id="fel">
        <h3>Font Awesome fa-external-link</h3>
        <p>
          <a href="https://google.com" target="_blank">
            Google
          </a>
        </p>
        <p>
          <a href="https://apple.com">Apple</a>
        </p>
        <p>
          <a href="https://yahoo.com" target="_blank">
            Yahoo
          </a>
        </p>
      </div>
    </>
  );
}
