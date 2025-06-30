import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/annotated-tables/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/annotated-tables/page.module.css';

import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/annotated-tables');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <h2>キーボードとスクリーンリーダに対応したアクセシブルなツールチップによる注釈を持つデータテーブルのデモ</h2>

      <button id={styles['table-caption']} className={styles.ttbtn} aria-expanded="false">
        <strong>SMART TOUCH LEARNING</strong>
        <br />
        損益計算書
        <br />
        2018年11月30日まで
      </button>
      <div role="tooltip">
        見出しには、事業の名前、明細書のタイトル、および期間が含まれます。損益計算書は常に月や年などの期間を表します。
      </div>

      <table aria-labelledby={styles['table-caption']}>
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
            <td>
              <button className={styles.ttbtn} aria-expanded="false">
                $8,500
              </button>{' '}
              <div role="tooltip">収入項目は常に最初にリストアップされ、必要に応じて小計が表示されます。</div>
            </td>
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
            <td>
              <button className={styles.ttbtn} aria-expanded="false">
                $2,000
              </button>{' '}
              <div role="tooltip">
                経費項目は大きい額から最小のものへと順にリストされ、必要に応じて小計が表示されます。
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">給与経費</th>
            <td className={styles.underline}>1,200</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '40px' }}>
              全費用
            </th>
            <td></td>
            <td className={styles.underline}>3,200</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td className={styles['double-underline']}>
              <button className={styles.ttbtn} aria-expanded="false">
                $5,300
              </button>{' '}
              <div role="tooltip">純利益は、総収入額から総経費を引いて計算されます。</div>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>ツールチップを使わず、注釈の表示非表示切り替えを1つのボタンで実装した例。</h2>

      <table className={styles['all-annotations']} aria-labelledby={styles['table-caption2']}>
        <thead>
          <tr>
            <td
              colSpan={3}
              id={styles['table-caption2']}
              className={clsx([styles['heading-info'], styles['info-cell']])}
            >
              {' '}
              <button aria-describedby="heading-info-text">
                <strong>SMART TOUCH LEARNING</strong>
                <br />
                損益計算書
                <br />
                2018年11月30日まで
              </button>
            </td>
          </tr>
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
            <td className={clsx([styles['service-revenue-info'], styles['info-cell']])} id="service-revenue-info-cell">
              <button aria-describedby="service-revenue-info-text">$8,500</button>
            </td>
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
            <td className={clsx([styles['rent-expense-info'], styles['info-cell']])} id="rent-expense-info-cell">
              <button aria-describedby="rent-expense-info-text">$2,000</button>
            </td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">給与経費</th>
            <td className={styles.underline}>1,200</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '40px' }}>
              全費用
            </th>
            <td></td>
            <td className={styles.underline}>3,200</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td
              className={clsx([styles['double-underline'], styles['net-income-info'], styles['info-cell']])}
              id="net-income-info-cell"
            >
              <button aria-describedby="net-income-info-text">$5,300</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles['annotations-wrapper']}>
        <h3>注釈</h3>
        <button id={styles['hide-show']} style={{ float: 'right', margin: '-2em 13em 0 0' }}>
          隠す
        </button>
        <div className={styles['heading-info']} id={styles['heading-info-text']}>
          <button aria-describedby={styles['table-caption2']}>
            テーブルキャプションには、事業の名前、明細書名、および期間が含まれます。損益計算書は常に月や年などの期間を明示します。
          </button>
        </div>
        <div className={styles['service-revenue-info']} id={styles['service-revenue-info-text']}>
          <button aria-describedby="service-revenue-info-cell">
            収入項目は常に最初にリストアップされ、必要に応じて小計が表示されます。
          </button>
        </div>
        <div className={styles['rent-expense-info']} id={styles['rent-expense-info-text']}>
          <button aria-describedby="rent-expense-info-cell">
            経費項目は大きい額から最小のものへと順にリストされ、必要に応じて小計が表示されます。
          </button>
        </div>
        <div className={styles['net-income-info']} id={styles['net-income-info-text']}>
          <button aria-describedby="net-income-info-cell">純利益は、総収入額から総経費を引いて計算されます。</button>
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
      <h2>データテーブル同士のセルの関連を表現する</h2>
      <div className={styles.tcol}>
        <table className={styles.t}>
          <caption>内部留保</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clos. 4 5,000</td>
              <td>0 Adj. Bal.</td>
            </tr>
            <tr>
              <td></td>
              <td>8,550 Clos. 3</td>
            </tr>
            <tr>
              <td></td>
              <td>3,550 Bal.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.tcol}>
        <table className={styles.t}>
          <caption>配当金</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 5,000</td>
              <td>5,000 Clos. 4</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>損益勘定</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clos. 2 8,950</td>
              <td>17,500 Clos. 1</td>
            </tr>
            <tr>
              <td></td>
              <td>8,550 Bal.</td>
            </tr>
            <tr>
              <td>Clos. 3 8,550</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>0 Bal.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.tcol}>
        <table className={styles.t}>
          <caption>役務収益</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clos. 1 17,500</td>
              <td>17,500 Adj. Bal.</td>
            </tr>
            <tr>
              <td></td>
              <td>0 Bal.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.tcol}>
        <table className={styles.t}>
          <caption>賃貸料</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 3,000</td>
              <td>3,000 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>支払給与</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 4,800</td>
              <td>4,800 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>消耗品費</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 400</td>
              <td>400 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>公共料金</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 100</td>
              <td>100 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>減価償却費（建物）</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 250</td>
              <td>250 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>減価償却費（器具・備品）</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 300</td>
              <td>300 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <table className={styles.t}>
          <caption>支払利息</caption>
          <thead>
            <tr>
              <th scope="col">借方</th>
              <th scope="col">貸方</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adj. Bal. 100</td>
              <td>100 Clos. 2</td>
            </tr>
            <tr>
              <td>Bal. 0</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
