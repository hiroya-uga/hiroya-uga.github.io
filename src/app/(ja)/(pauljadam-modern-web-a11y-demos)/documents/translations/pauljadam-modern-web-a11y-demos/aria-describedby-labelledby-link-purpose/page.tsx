import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/aria-describedby-labelledby-link-purpose/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: '機械的に関連づけるためのaria-Labelledby属性 VS aria-describedby属性',
  description: 'Web開発者の物置。',
};

export default function Page() {
  return (
    <>
      <h1>
        機械的に関連づけるための<code>aria-Labelledby</code>属性 VS <code>aria-describedby</code>
        属性
      </h1>

      <h2>
        リンクが<code>aria-labelledby</code>を持つ例
      </h2>

      <div id="sortby">並び替え順：</div>
      <ul>
        <li>
          <a href="#" aria-labelledby="sortby">
            価格
          </a>
        </li>
        <li>
          <a href="#" aria-labelledby="sortby">
            評価
          </a>
        </li>
        <li>
          <a href="#" aria-labelledby="sortby">
            名前
          </a>
        </li>
      </ul>

      <table>
        <caption>
          <h3>スクリーンリーダーの音声出力</h3>
        </caption>
        <tbody>
          <tr>
            <th>OSとブラウザ</th>
            <th>VoiceOver</th>
            <th>NVDA 2012.3.1</th>
            <th>JAWS 14</th>
          </tr>
          <tr>
            <th>Safari OS X 10.8.3</th>
            <td>リンク、価格、並び替え</td>
            <td>N/A</td>
            <td>N/A</td>
          </tr>
          <tr>
            <th>Mobile Safari iOS 6.1</th>
            <td>価格、リンク</td>
            <td>N/A</td>
            <td>N/A</td>
          </tr>
          <tr>
            <th>Firefox 19.0.2 Win 7</th>
            <td>N/A</td>
            <td>価格、リンク</td>
            <td>並び替え、リンク</td>
          </tr>
          <tr>
            <th>Internet Explorer 8 Win 7</th>
            <td>N/A</td>
            <td>価格、並び替え、リンク</td>
            <td>並び替え、リンク</td>
          </tr>
        </tbody>
      </table>

      <h2>
        リンクの説明と曖昧なリンクテキストのidを<code>aria-labelledby</code>に指定した例
      </h2>

      <div id="sortby2">並び替え順：</div>
      <ul>
        <li>
          <a id="price2" href="#" aria-labelledby="sortby2 price2">
            価格
          </a>
        </li>
        <li>
          <a id="rating2" href="#" aria-labelledby="sortby2 rating2">
            評価
          </a>
        </li>
        <li>
          <a id="name2" href="#" aria-labelledby="sortby2 name2">
            名前
          </a>
        </li>
      </ul>

      <h2>
        リンクが<code>aria-describedby</code>を持つ例
      </h2>

      <div id="sortby3">並び替え順：</div>
      <ul>
        <li>
          <a href="#" aria-describedby="sortby3">
            価格
          </a>
        </li>
        <li>
          <a href="#" aria-describedby="sortby3">
            評価
          </a>
        </li>
        <li>
          <a href="#" aria-describedby="sortby3">
            名前
          </a>
        </li>
      </ul>

      <h2>
        コンテナにgroupロールと<code>aria-labelledby</code>を持つ例
      </h2>

      <div role="group" aria-labelledby="sortby4">
        <div id="sortby4">並び替え順：</div>

        <ul>
          <li>
            <a href="#">価格</a>
          </li>
          <li>
            <a href="#">評価</a>
          </li>
          <li>
            <a href="#">名前</a>
          </li>
        </ul>
      </div>
    </>
  );
}
