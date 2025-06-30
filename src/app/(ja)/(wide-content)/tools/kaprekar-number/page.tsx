import { KaprekarNumberContent } from '@/app/(ja)/(wide-content)/tools/kaprekar-number/Client';
import { NoteBox } from '@/components/Box';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

import styles from '@/app/(ja)/(wide-content)/tools/kaprekar-number/page.module.css';

export const metadata = getMetadata('/tools/kaprekar-number');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} following={metadata.following} />
      <KaprekarNumberContent />
      <div className="mt-22">
        <NoteBox type="note" title="カプレカ数の例">
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>3桁のカプレカ数</th>
                <td>495</td>
                <td>1個</td>
              </tr>
              <tr>
                <th>4桁のカプレカ数</th>
                <td>6174</td>
                <td>1個</td>
              </tr>
              <tr>
                <th>5桁のカプレカ数</th>
                <td>null</td>
                <td>0個</td>
              </tr>
              <tr>
                <th>6桁のカプレカ数</th>
                <td>549945、631764</td>
                <td>2個</td>
              </tr>
              <tr>
                <th>7桁のカプレカ数</th>
                <td>null</td>
                <td>0個</td>
              </tr>
              <tr>
                <th>8桁のカプレカ数</th>
                <td>97508421</td>
                <td>1個</td>
              </tr>
              <tr>
                <th>8桁のカプレカ数</th>
                <td>97508421、63317664</td>
                <td>2個</td>
              </tr>
              <tr>
                <th>9桁のカプレカ数</th>
                <td>864197532、554999445</td>
                <td>2個</td>
              </tr>
              <tr>
                <th>10桁のカプレカ数</th>
                <td>9753086421、6333176664、9975084201</td>
                <td>3個</td>
              </tr>
              <tr>
                <th>11桁のカプレカ数</th>
                <td>86431976532</td>
                <td>1個</td>
              </tr>
              <tr>
                <th>12桁のカプレカ数</th>
                <td>975330866421、633331766664、555499994445、997530864201、999750842001</td>
                <td>5個</td>
              </tr>
              <tr>
                <th>13桁のカプレカ数</th>
                <td>8643319766532</td>
                <td>1個</td>
              </tr>
              <tr>
                <th>14桁のカプレカ数</th>
                <td>97755108844221、97533308666421、63333317666664、99753308664201、99975308642001、99997508420001</td>
                <td>6個</td>
              </tr>
              <tr>
                <th>15桁のカプレカ数</th>
                <td>864333197666532、555549999944445</td>
                <td>1個</td>
              </tr>
            </tbody>
          </table>
        </NoteBox>
      </div>
    </>
  );
}
