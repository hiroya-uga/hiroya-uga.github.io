'use client';

import clsx from 'clsx';
import { CSSProperties, useEffect, useId, useRef, useState } from 'react';
import { useFocusTrap, useKeyQuest, useQuestTimer } from '../hooks';
import { Quest } from '../quests';
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

const HINT_DELAY = 3000;

const QuestHint = ({ hint }: Readonly<{ hint: string }>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), HINT_DELAY);

    return () => window.clearTimeout(timeout);
  }, []);

  return isVisible ? `ヒント：${hint}` : null;
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
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [questIndex]);

  return (
    <div className="pointer-events-none grid cursor-none grid-rows-[auto_1fr_auto]">
      <h2 className="bg-secondary p-16PX sticky top-0" id={id}>
        {`お題：${quest.title}`}
      </h2>

      <div
        ref={ref}
        className="p-16PX scrollbar-gutter-stable mx-2PX grid place-items-center overflow-auto -outline-offset-2"
        role="region"
        aria-labelledby={id}
        tabIndex={0}
      >
        {quest.type === 'node' && <quest.Node onClear={onClear} onFail={onFail} />}
        {quest.type === 'key' && (
          <p className="text-4xl">
            <quest.Node />
          </p>
        )}
      </div>
      <p
        key={questIndex}
        className={clsx([
          'pr-16PX pb-2PX sticky bottom-0 grid grid-cols-[1fr_auto] items-end gap-[1em] text-right',
          shouldEnableAnimation &&
            shouldEnableTimeLimit && [
              styles.timeBar,
              'after:bg-accent after:h-3PX after:absolute after:bottom-0 after:left-0 after:w-full',
            ],
        ])}
        style={{ '--x-duration': quest.timeLimit !== undefined ? `${quest.timeLimit}ms` : undefined } as CSSProperties}
      >
        <span role="status" className="pl-16PX float-left max-w-[75%] text-left text-sm">
          <QuestHint hint={quest.hint} />
        </span>
        <span className={clsx([remainingMs !== null ? 'visible' : 'invisible'])}>
          残り：<span className="font-sans tabular-nums">{formatRemaining(remainingMs ?? 0)}</span>秒
        </span>
      </p>
    </div>
  );
};
