'use client';

import clsx from 'clsx';

interface Props {
  ratio: number;
  isHidden: boolean;
}

export const ProgressMeter = ({ ratio, isHidden }: Props) => {
  return (
    <p
      className={clsx([
        'px-9px w800px:py-0 w800px:pr-0 w800px:pt-5 transition-fade starting:opacity-0 w800px:block transition-discrete bg-primary sticky bottom-0 mt-5 flex grow items-center justify-between gap-2 border-t border-dashed border-t-gray-600 py-2 font-bold',
        isHidden && 'invisible opacity-0',
      ])}
    >
      <span className="block text-sm">進捗率</span>
      <span className="w800px:text-[min(80px,6vw)] block text-right text-2xl leading-[1.75]" aria-hidden="true">
        {ratio}
        <span className="w800px:text-[0.5em]">%</span>
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{`${ratio}%`}</span>
    </p>
  );
};
