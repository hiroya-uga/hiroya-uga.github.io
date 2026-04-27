import { convertBreakLineToElement } from '@/utils/break-line';
import clsx from 'clsx';

import type { HistoryItem } from '../constants';
import { HistoryDate } from './HistoryDate';

type Props = {
  data: string;
  descriptionsCount: number;
  item: HistoryItem;
  index: number;
};

export const HistoryRow = ({ data, descriptionsCount, item, index }: Props) => {
  const description = typeof item === 'string' ? item : item.description;
  const date = typeof item === 'string' ? null : (item.date ?? null);
  const embed = typeof item === 'string' ? null : (item.embed ?? null);
  const isPeriod = index === 0;
  const hasDate = date !== null;

  return (
    <tr className={clsx(['@w640:grid @w640:grid-cols-subgrid @w640:col-span-2 group contents', isPeriod && 'mt-7'])}>
      {isPeriod && (
        <th
          rowSpan={descriptionsCount}
          scope="rowgroup"
          className={clsx([
            '@w640:mt-0 @w640:font-normal @w640:text-sm @w640:p-0 @w640:static @w640:after:hidden @w640:bg-transparent',
            'text-secondary bg-primary sticky top-0 z-10 mt-12 pb-2 pt-4 text-left align-top font-bold',
            'after:h-1px after:border-secondary after:absolute after:bottom-2 after:left-0 after:top-4 after:my-auto after:w-full after:border-t',
          ])}
        >
          <span className="bg-primary @w640:py-0.5 @w640:pr-0 @w640:top-2 relative z-10 block w-fit pr-2">
            <HistoryDate data={data} />
          </span>
        </th>
      )}
      {hasDate && (
        <th
          scope="row"
          className={clsx([
            '@w640:mt-4 @w640:p-0 @w640:text-sm @w640:font-normal @w640:text-right @w640:pt-3px',
            'text-secondary bg-primary animate-fade-up mt-6 pb-2.5 pl-2.5 text-left',
          ])}
        >
          <time dateTime={date.replace('.', '-')}>{date}</time>
        </th>
      )}
      <td
        colSpan={hasDate ? 1 : 2}
        className={clsx([
          '@w640:pl-0',
          'animate-fade-up relative pr-2',
          isPeriod && '@w640:mt-10',
          hasDate && [
            '@w640:mt-4 @w640:pl-12px @w640:flex @w640:before:border-t @w640:before:w-3 @w640:before:top-15px @w640:before:absolute @w640:relative @w640:before:right-full @w640:before:pointer-events-none @w640:before:translate-x-8px @w640:before:border-t-primary',
            'pl-5',
          ],
          (isPeriod || hasDate === false) && '@w640:col-start-2',
          hasDate || [
            '@w640:before:mt-3.5 @w640:col-start-1',
            'pl-2.5',
            "before:size-4px before:bg-(--color-primary) flex gap-x-2 before:mt-2.5 before:inline-block before:shrink-0 before:rounded-full before:content-['']",
          ],
        ])}
      >
        <div>
          {typeof description === 'string'
            ? convertBreakLineToElement(description, { className: 'block' })
            : description}
          {embed !== null && <div className="animate-fade-up @w640:max-w-full -ml-0.5 mt-4">{embed}</div>}
        </div>
      </td>
    </tr>
  );
};
