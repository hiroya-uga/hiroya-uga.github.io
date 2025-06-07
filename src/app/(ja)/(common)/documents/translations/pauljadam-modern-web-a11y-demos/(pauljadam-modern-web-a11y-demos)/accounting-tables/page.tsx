import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/accounting-tables/page.module.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/accounting-tables');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>

      <h2>
        1行が複数行にわたる2つの行ヘッダーを持つ表。
        <code>thead</code>要素の列ヘッダは <code>font-size: 0px; height: 0px</code> で視覚的に隠されています。
      </h2>

      <table>
        <caption>
          <strong>CAMPUS APARTMENT LOCATORS</strong>
          <br />
          損益計算書
          <br />
          2018年11月30日まで
        </caption>
        <thead>
          <tr>
            <th scope="col">所得タイプ</th>
            <th scope="col">収入または費用</th>
            <th scope="col">借方</th>
            <th scope="col">貸方</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">収入：</th>
            <th scope="row">サービス収入</th>
            <td></td>
            <td>$ 1,900</td>
          </tr>
          <tr>
            <th rowSpan={3} scope="rowgroup">
              経費：
            </th>
            <th scope="row">家賃</th>
            <td>$ 400</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">水道光熱費</th>
            <td className={styles.underline}>100</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '20px' }}>
              全費用
            </th>
            <td></td>
            <td className={styles.underline}>500</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td></td>
            <td className={styles['double-underline']}>$ 1,400</td>
          </tr>
        </tbody>
      </table>

      <p>
        <small>※ iOSのVoiceOverは、CSSで視覚的に隠された列ヘッダを読み上げませんでした。</small>
      </p>

      <h2>
        1行が複数行にわたる2つの行ヘッダーを持つ表。 マークアップは上記の表と同じですが、列ヘッダーが隠されていません。
      </h2>

      <table>
        <caption>
          <strong>CAMPUS APARTMENT LOCATORS</strong>
          <br />
          損益計算書
          <br />
          2018年11月30日まで
        </caption>
        <thead>
          <tr>
            <th scope="col">所得タイプ</th>
            <th scope="col">収入または費用</th>
            <th scope="col">借方</th>
            <th scope="col">貸方</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">収入：</th>
            <th scope="row">サービス収入</th>
            <td></td>
            <td>$ 1,900</td>
          </tr>
          <tr>
            <th rowSpan={3} scope="rowgroup">
              経費：
            </th>
            <th scope="row">家賃</th>
            <td>$ 400</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">水道光熱費</th>
            <td className={styles.underline}>100</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '20px' }}>
              全費用
            </th>
            <td></td>
            <td className={styles.underline}>500</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td></td>
            <td className={styles['double-underline']}>$ 1,400</td>
          </tr>
        </tbody>
      </table>

      <p>
        <small>
          ※
          iOSのVoiceOverは各データセルの最初の行ヘッダのみを読み上げます。しかし、固有の行ヘッダーは2列目にあり、読み上げられません。macOSのVoiceOverは、このテーブルをうまく理解し、すべての列と行のヘッダを予想通りに読み上げます。
        </small>
      </p>

      <h2>
        <code>tbody</code>要素に複数の列ヘッダーがある表。
        <code>thead</code>要素の列ヘッダは <code>font-size: 0px; height: 0px</code> で視覚的に隠されています。
      </h2>

      <table>
        <caption>
          <strong>CAMPUS APARTMENT LOCATORS</strong>
          <br />
          損益計算書
          <br />
          2018年11月30日まで
        </caption>
        <thead>
          <tr>
            <th scope="col">収入または費用</th>
            <th scope="col">借方</th>
            <th scope="col">貸方</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col">収入：</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '20px' }}>
              サービス収入
            </th>
            <td></td>
            <td>$ 1,900</td>
          </tr>
          <tr>
            <th scope="col">経費：</th>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '20px' }}>
              家賃
            </th>
            <td>$ 400</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '20px' }}>
              水道光熱費
            </th>
            <td className={styles.underline}>100</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '40px' }}>
              全費用
            </th>
            <td></td>
            <td className={styles.underline}>500</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td className={styles['double-underline']}>$ 1,400</td>
          </tr>
        </tbody>
      </table>

      <p>
        <small>
          ※ iOSのVoiceOverは、各データセルの行ヘッダーと列ヘッダーを読み上げます。 <code>tbody</code>
          要素内の複数列にわたる列ヘッダーは、iOS・macOSともにVoiceOverは列ヘッダーとしては読み上げませんでした。この表の表現方法が悪いため、スクリーンリーダーが列ヘッダーとして「収入：」と「経費：」という文字列を読み上げることは重要ではありません。
        </small>
      </p>

      <p>
        <small>※ このデータテーブルはモバイルユーザーにとって最高のエクスペリエンスです。</small>
      </p>

      <p>
        <small>
          ※
          AndroidのChromeとTalkBackでは、データテーブルのアクセシビリティはサポートされていません。行と列のヘッダーはデータセルには表示されません。
        </small>
      </p>

      <p>
        <small>
          ※ AndroidのFirefoxとTalkBackでは、このページで紹介した両方のテクニックを非常によくサポートしています。
          VoiceOverよりも優れています。
        </small>
      </p>
    </div>
  );
}
