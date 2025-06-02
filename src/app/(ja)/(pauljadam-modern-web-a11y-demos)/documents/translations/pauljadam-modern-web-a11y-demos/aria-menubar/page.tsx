import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-menubar/DocumentScript';

import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-menubar/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/aria-menubar');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <nav role="navigation">
        <div id="nav-menu" role="menubar">
          <a
            href="#"
            id="clothes-menuitem"
            role="menuitem"
            aria-haspopup="true"
            aria-controls="clothes-menu"
            aria-expanded="false"
          >
            ファイル
          </a>
          <div id="clothes-menu" role="menu" aria-hidden="true" className="visually-hidden">
            <a href="#" role="menuitem">
              新しいファイル
            </a>
            <a href="#" role="menuitem">
              新しいウィンドウ
            </a>
            <hr />
            <a href="#" role="menuitem">
              開く
            </a>
            <a href="#" role="menuitem">
              ワークスペースを開く
            </a>
          </div>
          <a
            href="#"
            id="outdoors-menuitem"
            role="menuitem"
            aria-haspopup="true"
            aria-controls="outdoors-menu"
            aria-expanded="false"
          >
            編集
          </a>
          <div id="outdoors-menu" role="menu" aria-hidden="true" className="visually-hidden">
            <a href="#" role="menuitem">
              元に戻す
            </a>
            <a href="#" role="menuitem">
              やりなおす
            </a>
            <hr />
            <a href="#" role="menuitem">
              切り取り
            </a>
            <a href="#" role="menuitem">
              コピー
            </a>
            <a href="#" role="menuitem">
              貼り付け
            </a>
          </div>
          <a
            href="#"
            id="shoes-menuitem"
            role="menuitem"
            aria-haspopup="true"
            aria-controls="shoes-menu"
            aria-expanded="false"
          >
            選択
          </a>
          <div id="shoes-menu" role="menu" aria-hidden="true" className="visually-hidden">
            <a href="#" role="menuitem">
              全て選択
            </a>
            <a href="#" role="menuitem">
              選択範囲の展開
            </a>
            <a href="#" role="menuitem">
              選択範囲の縮小
            </a>
          </div>
        </div>
      </nav>

      <p>
        <a href="http://www.w3.org/WAI/PF/aria-practices/#menu">ARIA Menu Authoring Practices 1.1</a>
      </p>
    </>
  );
}
