'use client';

import { ACHIEVEMENTS, type AchievementKey } from '@/hooks/use-achievement';
import { useLocalStorage } from '@/hooks/use-storage';
import { objectEntries } from '@/utils/object-utils';
import clsx from 'clsx';

const MASKED_SYMBOL = '？';
const MASKED_TEXT = '？？？？？？？？';

interface AchievementItemProps {
  achievementKey: AchievementKey;
  isDone: boolean;
}

const AchievementItem = ({ achievementKey, isDone }: Readonly<AchievementItemProps>) => {
  const { symbol, title, description, hidden } = ACHIEVEMENTS[achievementKey];

  return (
    <div className="gap-x-8PX group grid grid-cols-[64px_1fr] grid-rows-[auto_1fr]">
      <dt className="contents">
        <span
          className={clsx([
            'row-span-2 grid size-16 place-items-center rounded text-[32px]',
            isDone ? 'bg-secondary shadow' : 'opacity-50 grayscale',
          ])}
        >
          {isDone === false && hidden?.symbol === true ? MASKED_SYMBOL : symbol}
        </span>
        <span className="col-start-2 row-start-1 pt-1">
          {isDone === false && hidden?.title === true ? MASKED_TEXT : title}
        </span>
      </dt>
      <dd className="text-secondary col-start-2 row-start-2 text-xs">
        {isDone === false && hidden?.description === true ? MASKED_TEXT : description}
        <span className="sr-only">{isDone ? '獲得済み' : '未獲得'}</span>
      </dd>
    </div>
  );
};

export const AchievementsSection = () => {
  const achievements = useLocalStorage('achievement');

  if (achievements === null) {
    return null;
  }

  const keys = objectEntries(ACHIEVEMENTS).map(([key]) => key);
  const unlockedKeys = keys.filter((key) => key in achievements);
  const lockedKeys = keys.filter((key) => key in achievements === false);

  return (
    <div className="border-t-secondary pt-(--x-section-padding-top) mt-(--x-section-margin-top) border-t border-dashed">
      <h2>🏆 Achievements</h2>
      <p className="w640:mb-7 mb-3.5">このブラウザであなたが解除した実績一覧です！</p>

      <div className="@container">
        <dl className="gap-16PX @w640:grid-cols-2 grid">
          {unlockedKeys.map((key) => (
            <AchievementItem key={key} achievementKey={key} isDone={true} />
          ))}
        </dl>

        <h3 className="w640:mb-7 before:h-2px before:border-primary relative mb-3.5 mt-12 before:absolute before:inset-0 before:m-auto before:w-full before:border before:border-dashed">
          <span className="bg-primary relative mx-auto block w-fit px-1">残りの実績</span>
        </h3>

        <dl className="gap-16PX @w640:grid-cols-2 grid">
          {lockedKeys.map((key) => (
            <AchievementItem key={key} achievementKey={key} isDone={false} />
          ))}
        </dl>
      </div>
    </div>
  );
};
