import clsx from 'clsx';
import { UNSUPPORTED_LABEL } from '../utils';
import { useUnsupportedLabel } from './UnsupportedLabelContext';

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  note?: { marker: string; text: React.ReactNode };
}

export const Row = ({ label, value, note }: Readonly<Props>) => {
  const unsupportedLabel = useUnsupportedLabel();
  const isUnsupported = value === UNSUPPORTED_LABEL;
  const displayValue = isUnsupported ? unsupportedLabel : value;

  return (
    <div
      className={clsx([
        'pb-3',
        'w640:grid w640:grid-cols-subgrid w640:col-span-2 w640:py-0',
        'w640:even:bg-secondary/40 w640:border-secondary w640:not-last:border-b',
      ])}
    >
      <dt
        className={clsx([
          'px-4PX mb-1 bg-slate-200 py-1 font-sans font-bold leading-normal dark:bg-slate-800',
          'w640:border-secondary w640:mb-0 w640:border-r w640:px-10PX w640:py-2',
        ])}
      >
        {label}
      </dt>
      <dd
        className={clsx([
          'w640:dark:bg-secondary px-6PX w640:bg-[ghostwhite] break-all',
          'w640:min-w-0 w640:px-12PX w640:py-2',
        ])}
      >
        <div
          className={clsx([
            displayValue !== null && displayValue !== undefined && displayValue !== '' && 'animate-fade-in',
            isUnsupported && 'text-secondary',
            'min-h-lh whitespace-pre-wrap font-sans leading-normal',
          ])}
        >
          {displayValue}
        </div>
        {note !== undefined && (
          <p className="text-secondary gap-x-4PX mt-1 flex text-xs">
            <span>{note.marker}</span>
            <small>{note.text}</small>
          </p>
        )}
      </dd>
    </div>
  );
};
