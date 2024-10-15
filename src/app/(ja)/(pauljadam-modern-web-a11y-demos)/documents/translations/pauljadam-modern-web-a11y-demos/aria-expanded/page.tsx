import {
  DocumentScriptA,
  DocumentScriptB,
  DocumentScriptC,
} from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-expanded/DocumentScript';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: "aria-expanded属性の状態をスクリーンリーダに伝える - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "aria-expanded属性の状態をスクリーンリーダに伝える - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
});

export default function Page() {
  return (
    <>
      <h1>
        <code>aria-expanded</code>属性の状態をスクリーンリーダに伝える
      </h1>

      <h2>
        <code>aria-expanded</code>を持つリンク
      </h2>
      <p>
        <a href="#" aria-expanded="true" aria-controls="dynamic-container">
          <span aria-hidden="true">[-]</span>詳細
        </a>
      </p>
      <div id="dynamic-container">
        <p>詳細テキスト詳細テキスト詳細テキスト詳細テキスト</p>
      </div>

      <DocumentScriptA />

      <h2>
        <code>aria-expanded</code>を持つボタン
      </h2>
      <p>
        <button aria-expanded="true" aria-controls="dynamic-button-container">
          <span aria-hidden="true">[-]</span>詳細
        </button>
      </p>
      <div id="dynamic-button-container">
        <p>詳細テキスト詳細テキスト詳細テキスト詳細テキスト</p>
      </div>

      <DocumentScriptB />

      <h2>
        <code>aria-expanded</code>を持つタブ
      </h2>

      <div id="tablist">
        <span>タブ1</span> <span>タブ2</span> <span>タブ3</span>
      </div>
      <div className="tab-panel" id="tp1">
        <p>タブパネル 1</p>
      </div>
      <div className="tab-panel" id="tp2">
        <p>タブパネル 2</p>
      </div>
      <div className="tab-panel" id="tp3">
        <p>タブパネル 3</p>
      </div>

      <DocumentScriptC />
    </>
  );
}
