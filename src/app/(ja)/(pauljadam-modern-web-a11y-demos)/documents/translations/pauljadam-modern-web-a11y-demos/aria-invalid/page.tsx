import { SelfLink } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-invalid/Client';
import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-invalid/DocumentScript';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-invalid/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'aria-invalid="true"の実装例 - PaulJAdam\'s Modern Web Accessibility Demos',
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
};

export default function Page() {
  return (
    <>
      <h1>
        <code>aria-invalid="true"</code>の実装例
      </h1>

      <DocumentScript />

      <SelfLink />

      <h2>
        <code>fieldset</code>要素内にある<code>label</code>要素と関連づいていないセレクトボックス
      </h2>

      <form action="" name="someform">
        <fieldset>
          <legend>日付を選択してください*</legend>
          <select id="daydropdown" title="日" aria-invalid="true" aria-required="true"></select>
          <select id="monthdropdown" title="月" aria-invalid="true" aria-required="true"></select>
          <select id="yeardropdown" title="年" aria-invalid="true" aria-required="true"></select>
        </fieldset>
      </form>

      <h2>
        <code>fieldset</code>要素内にある<code>label</code>要素と関連づいていないテキストフィールド
      </h2>

      <fieldset>
        <legend>お電話番号*</legend>
        <input
          id="areaCode"
          name="areaCode"
          title="市外局番"
          type="text"
          size={3}
          defaultValue=""
          aria-invalid="true"
          aria-required="true"
        />
        <input
          id="exchange"
          name="exchange"
          title="市内局番"
          type="text"
          size={3}
          defaultValue=""
          aria-invalid="true"
          aria-required="true"
        />
        <input
          id="lastDigits"
          name="lastDigits"
          title="加入者番号"
          type="text"
          size={4}
          defaultValue=""
          aria-invalid="true"
          aria-required="true"
        />
      </fieldset>

      <h2>
        <code>textarea</code>要素
      </h2>

      <label htmlFor="textarea">メッセージ*</label>
      <br />

      <textarea id="textarea" cols={20} rows={10} aria-required="true" aria-invalid="true"></textarea>

      <h2>
        <code>optgroup</code>要素を持つセレクトボックス
      </h2>
      <label>
        食べ物を選択してください（必須）
        <select aria-required="true" aria-invalid="true" defaultValue="1">
          <optgroup label="果物">
            <option>バナナ</option>
            <option defaultValue="1">さくらんぼ</option>
            <option>レモン</option>
          </optgroup>
          <optgroup label="野菜">
            <option>にんじん</option>
            <option>なす</option>
            <option>じゃがいも</option>
          </optgroup>
        </select>
      </label>

      <h2>チェックボックス</h2>

      <fieldset data-role="controlgroup">
        <legend>宿泊施設に必要な設備を選択してください*</legend>
        <input type="checkbox" name="a11y" defaultValue="点字" id="a11y_0" aria-required="true" aria-invalid="true" />
        <label htmlFor="a11y_0">点字</label>
        <input
          type="checkbox"
          name="a11y"
          defaultValue="大きい文字"
          id="a11y_1"
          aria-required="true"
          aria-invalid="true"
        />
        <label htmlFor="a11y_1">大きい文字</label>
        <input
          type="checkbox"
          name="a11y"
          defaultValue="手話通訳"
          id="a11y_2"
          aria-required="true"
          aria-invalid="true"
        />
        <label htmlFor="a11y_2">手話通訳</label>
        <input
          type="checkbox"
          name="a11y"
          defaultValue="リアルタイム字幕"
          id="a11y_3"
          aria-required="true"
          aria-invalid="true"
        />
        <label htmlFor="a11y_3">リアルタイム字幕</label>
        <input type="checkbox" name="a11y" defaultValue="車椅子" id="a11y_4" aria-required="true" aria-invalid="true" />
        <label htmlFor="a11y_4">車椅子</label>
      </fieldset>

      <h2>ラジオボタン</h2>

      <fieldset data-role="controlgroup">
        <legend>お食事を選択してください*</legend>
        <label>
          <input type="radio" name="meal" defaultValue="野菜" id="meal_0" aria-required="true" aria-invalid="true" />
          野菜
        </label>
        <label>
          <input type="radio" name="meal" defaultValue="牛肉" id="meal_1" aria-required="true" aria-invalid="true" />
          牛肉
        </label>
        <label>
          <input type="radio" name="meal" defaultValue="鶏肉" id="meal_2" aria-required="true" aria-invalid="true" />
          鶏肉
        </label>
        <label>
          <input type="radio" name="meal" defaultValue="魚" id="meal_3" aria-required="true" aria-invalid="true" />
          魚（サーモン）
        </label>
      </fieldset>
    </>
  );
}
