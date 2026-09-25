'use client';

import clsx from 'clsx';
import { CSSProperties, useEffect, useId, useRef } from 'react';
import { useFocusTrap, useKeyQuest, useQuestTimer } from '../hooks';
import { MODIFIER_LABELS, Quest } from '../quests';
import styles from './PlayingScreen.module.css';

interface Props {
  quest: Quest;
  questIndex: number;
  shouldEnableTimeLimit: boolean;
  shouldEnableAnimation: boolean;
  onClear: () => void;
  onFail: () => void;
}

const formatRemaining = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const PlayingScreen = ({
  quest,
  questIndex,
  shouldEnableTimeLimit,
  shouldEnableAnimation,
  onClear,
  onFail,
}: Readonly<Props>) => {
  const id = useId();

  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap({ containerRef: ref });
  useKeyQuest({ quest, onClear, onFail });
  const remainingMs = useQuestTimer({
    isEnabled: shouldEnableTimeLimit,
    quest,
    onTimeout: onFail,
  });

  useEffect(() => {
    queueMicrotask(() => {
      ref.current?.focus({ preventScroll: true });
    });
  }, [questIndex]);

  return (
    <div className="pointer-events-none grid cursor-none grid-rows-[auto_1fr_auto]">
      <h2 className="bg-secondary p-16PX sticky top-0" id={id}>
        {`お題：${quest.title}`}
      </h2>

      <div
        ref={ref}
        className="p-16PX scrollbar-gutter-stable mx-2PX grid place-items-center overflow-auto outline-offset-[-2px]"
        role="region"
        aria-labelledby={id}
        tabIndex={0}
      >
        {quest.type === 'node' && <quest.Node onClear={onClear} onFail={onFail} />}
        {quest.type === 'key' && (
          <p className="text-4xl">
            {quest.modifiers?.map((modifier) => (
              <span key={modifier}>
                <kbd>{MODIFIER_LABELS[modifier]}</kbd>+
              </span>
            ))}
            <kbd>{quest.key}</kbd>
          </p>
        )}
      </div>
      <p
        key={questIndex}
        className={clsx([
          'pr-16PX pb-2PX sticky bottom-0 text-right',
          shouldEnableAnimation && [
            styles.timeBar,
            'after:bg-accent after:h-3PX after:absolute after:bottom-0 after:left-0 after:w-full',
          ],
          remainingMs !== null ? 'visible' : 'invisible',
        ])}
        style={{ '--x-duration': quest.timeLimit !== undefined ? `${quest.timeLimit}ms` : undefined } as CSSProperties}
      >
        残り：<span className="font-sans tabular-nums">{formatRemaining(remainingMs ?? 0)}</span>秒
      </p>
    </div>
  );
};
