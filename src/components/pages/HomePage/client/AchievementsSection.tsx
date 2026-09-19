'use client';

import { ACHIEVEMENTS } from '@/hooks/use-achievement';
import { useLocalStorage } from '@/hooks/use-storage';
import { objectEntries } from '@/utils/object-utils';
import clsx from 'clsx';

export const AchievementsSection = () => {
  const achievements = useLocalStorage('achievement');

  if (achievements === null) {
    return null;
  }

  return (
    <div className="w640:grid w640:gap-x-48PX border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) border-t border-dashed">
      <h2 className="col-start-1 col-end-2 row-start-1 row-end-2">🏆 Achievements</h2>
      <p className="w640:mb-7 mb-3.5">このブラウザであなたが解除した実績一覧です！</p>

      <div className="@container">
        <dl className="gap-16PX @w640:grid-cols-2 grid">
          {objectEntries(ACHIEVEMENTS).map(([key, { symbol, title, description, hidden }]) => {
            const isDone = key in achievements;

            return (
              <div key={key} className="gap-x-8PX group grid grid-cols-[64px_1fr] grid-rows-[auto_1fr]">
                <dt className="contents">
                  <span
                    className={clsx([
                      'row-span-2 grid size-16 place-items-center rounded text-[32px]',
                      isDone ? 'bg-secondary shadow' : 'opacity-50 grayscale',
                    ])}
                  >
                    {symbol}
                  </span>
                  <span className="col-start-2 row-start-1 pt-1">{title}</span>
                </dt>
                <dd className="text-secondary col-start-2 row-start-2 text-xs">
                  {hidden === true ? '？？？？？？？？' : description}
                  <span className="sr-only">{isDone ? '獲得済み' : '未獲得'}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
};
