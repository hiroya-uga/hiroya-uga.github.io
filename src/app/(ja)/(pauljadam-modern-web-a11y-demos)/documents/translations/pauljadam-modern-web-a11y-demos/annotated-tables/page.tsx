import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/annotated-tables/DocumentScript';

import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/annotated-tables/page.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/annotated-tables');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />

      <h2>キーボードとスクリーンリーダに対応したアクセシブルなツールチップによる注釈を持つデータテーブルのデモ</h2>

      <button id="table-caption" className="ttbtn" aria-expanded="false">
        <strong>SMART TOUCH LEARNING</strong>
        <br />
        損益計算書
        <br />
        2018年11月30日まで
      </button>
      <div role="tooltip">
        見出しには、事業の名前、明細書のタイトル、および期間が含まれます。損益計算書は常に月や年などの期間を表します。
      </div>

      <table aria-labelledby="table-caption">
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
              <button className="ttbtn" aria-expanded="false">
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
              <button className="ttbtn" aria-expanded="false">
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
            <td className="underline">1,200</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '40px' }}>
              全費用
            </th>
            <td></td>
            <td className="underline">3,200</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td className="double-underline">
              <button className="ttbtn" aria-expanded="false">
                $5,300
              </button>{' '}
              <div role="tooltip">純利益は、総収入額から総経費を引いて計算されます。</div>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>ツールチップを使わず、注釈の表示非表示切り替えを1つのボタンで実装した例。</h2>

      <table className="all-annotations" aria-labelledby="table-caption2">
        <thead>
          <tr>
            <td colSpan={3} id="table-caption2" className="heading-info info-cell">
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
            <td className="service-revenue-info info-cell" id="service-revenue-info-cell">
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
            <td className="rent-expense-info info-cell" id="rent-expense-info-cell">
              <button aria-describedby="rent-expense-info-text">$2,000</button>
            </td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">給与経費</th>
            <td className="underline">1,200</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" style={{ paddingLeft: '40px' }}>
              全費用
            </th>
            <td></td>
            <td className="underline">3,200</td>
          </tr>
          <tr>
            <th scope="row">当期純利益</th>
            <td></td>
            <td className="double-underline net-income-info info-cell" id="net-income-info-cell">
              <button aria-describedby="net-income-info-text">$5,300</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="annotations-wrapper">
        <h3>注釈</h3>
        <button id="hide-show" style={{ float: 'right', margin: '-2em 13em 0 0' }}>
          隠す
        </button>
        <div className="heading-info" id="heading-info-text">
          <button aria-describedby="table-caption2">
            テーブルキャプションには、事業の名前、明細書名、および期間が含まれます。損益計算書は常に月や年などの期間を明示します。
          </button>
        </div>
        <div className="service-revenue-info" id="service-revenue-info-text">
          <button aria-describedby="service-revenue-info-cell">
            収入項目は常に最初にリストアップされ、必要に応じて小計が表示されます。
          </button>
        </div>
        <div className="rent-expense-info" id="rent-expense-info-text">
          <button aria-describedby="rent-expense-info-cell">
            経費項目は大きい額から最小のものへと順にリストされ、必要に応じて小計が表示されます。
          </button>
        </div>
        <div className="net-income-info" id="net-income-info-text">
          <button aria-describedby="net-income-info-cell">純利益は、総収入額から総経費を引いて計算されます。</button>
        </div>
      </div>
      <div style={{ clear: 'both' }}></div>
      <h2>データテーブル同士のセルの関連を表現する</h2>
      <div className="tcol">
        <table className="t">
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
      <div className="tcol">
        <table className="t">
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
        <table className="t">
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
      <div className="tcol">
        <table className="t">
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
      <div className="tcol">
        <table className="t">
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
        <table className="t">
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
        <table className="t">
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
        <table className="t">
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
        <table className="t">
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
        <table className="t">
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
        <table className="t">
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
    </>
  );
}
