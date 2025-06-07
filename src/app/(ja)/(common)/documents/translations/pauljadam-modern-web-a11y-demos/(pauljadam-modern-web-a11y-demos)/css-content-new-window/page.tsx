import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/css-content-new-window/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/css-content-new-window/page.module.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/css-content-new-window');

export default function Page() {
  return (
    <div className={styles.page}>
      {/* <link rel="stylesheet" href="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" /> */}
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            html[lang] {
              font-size: inherit;
            }`,
        }}
      />

      <DocumentScript />

      <h1>{metadata.pageTitle}</h1>

      <h2>
        BootstrapやFont Awesome FrameworksによるCSS由来の別窓アイコンおよび、JavaScriptで title
        属性値に別窓で開くことを知らせるための説明テキストを設定する例
      </h2>

      <p>
        14/7/21 更新: このデモでは、title
        属性が代替テキストとして機能しているため、アイコンフォントをVoiceOverに読み上げさせないために「CSS4
        alt」を設定しています。title属性ではなく、alt プロパティが利用されている新しいDEMOをご覧ください。
        <br />→ <a href="../css4altgeneratedcontent">CSS4 Alt text for Generated Content</a>.
      </p>

      <div id={styles.gnw}>
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
      <div id={styles.gmw}>
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
      <div id={styles.fels}>
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
      <div id={styles.fel}>
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
    </div>
  );
}
