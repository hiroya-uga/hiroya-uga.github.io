import clsx from 'clsx';
import { useId } from 'react';
import type { QuestResult } from '../types';

interface Props {
  results: QuestResult[];
  shouldEnableAnimation: boolean;
  onRetry: () => void;
}

export const ResultScreen = ({ results, shouldEnableAnimation, onRetry }: Readonly<Props>) => {
  const id = useId();

  return (
    <section
      tabIndex={0}
      className={clsx([
        'p-16PX pb-32PX max-h-full w-full overflow-auto rounded -outline-offset-4',
        shouldEnableAnimation && 'animate-fade-in opacity-0',
      ])}
      ref={(element) => element?.focus()}
      aria-labelledby={id}
    >
      <h2 id={id} className="mb-4 text-2xl font-bold">
        結果発表
      </h2>
      <dl className="space-y-3">
        {results.map((entry, index) => {
          const key = `第${(index + 1).toString().padStart(2, '0')}問：`;
          return (
            <div key={key} className="border-primary p-16PX rounded border">
              <dt className="font-bold">{`${key}${entry.quest.title}`}</dt>
              <dd className="text-secondary mt-1 text-sm">
                <span
                  className={clsx([
                    'px-8PX mr-2 inline-block rounded',
                    entry.result === 'success' ? 'bg-success' : 'bg-error',
                  ])}
                >
                  {entry.result === 'success' ? 'Success' : 'Failed'}
                </span>
                {entry.quest.explanation}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-6 text-center">
        <button type="button" className="bg-secondary border-primary rounded border px-6 py-2" onClick={onRetry}>
          Retry
        </button>
      </p>
    </section>
  );
};
