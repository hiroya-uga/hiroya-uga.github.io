import Link from 'next/link';

import { Heading } from '@/components/Heading';

import type { HistoryItem } from '../constants';
import { PERSONAL_HISTORY } from '../constants';
import { HistoryRow } from './HistoryRow';

const getItemKey = (item: HistoryItem): string => {
  if (typeof item === 'string') {
    return item;
  }
  if ('key' in item) {
    return item.key;
  }
  return item.description;
};

export const PersonalHistory = () => {
  return (
    <>
      <Heading level={3}>これまでのあらすじ</Heading>

      <div className="@w640:pl-0.5 pl-2">
        <p className="mb-paragraph text-sm">
          <Link href="/documents/media/">外部メディアリンク一覧はこちら</Link>をご覧ください。
        </p>

        <div className="@w640:after:w-1px @w640:after:border-primary @w640:after:absolute @w640:after:left-4 @w640:after:top-0 @w640:after:h-full @w640:after:border-l relative">
          <table className="@w640:text-base block-table text-sm">
            <thead className="sr-only">
              <tr>
                <th scope="col">時期</th>
                <th scope="col" colSpan={2}>
                  活動内容
                </th>
              </tr>
            </thead>
            <tbody className="@w640:grid @w640:grid-cols-[auto_1fr] @w640:gap-x-2">
              {PERSONAL_HISTORY.map(({ data, descriptions }) =>
                descriptions.map((item, index) => (
                  <HistoryRow
                    key={getItemKey(item)}
                    data={data}
                    descriptionsCount={descriptions.length}
                    item={item}
                    index={index}
                  />
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
