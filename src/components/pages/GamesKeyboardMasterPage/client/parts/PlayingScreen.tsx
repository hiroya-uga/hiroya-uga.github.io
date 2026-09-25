'use client';

import clsx from 'clsx';
import { CSSProperties, useEffect, useRef } from 'react';
import { MODIFIER_LABELS, Quest } from '../quests';
import styles from './PlayingScreen.module.css';

interface Props {
  quest: Quest;
  questIndex: number;
  remainingMs: number | null;
  shouldDisableAnimation: boolean;
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
  remainingMs,
  shouldDisableAnimation,
  onClear,
  onFail,
}: Readonly<Props>) => {
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      statusRef.current?.focus({ preventScroll: true });
    });
  }, [questIndex]);

  return (
    <>
      <p className="bg-secondary p-16PX sticky top-0">
        <span
          ref={statusRef}
          role="status"
          aria-live="assertive"
          aria-atomic="false"
          tabIndex={-1}
          className="block"
        >{`お題：${quest.title}`}</span>
      </p>
      {quest.type === 'node' && (
        <div className="p-16PX grid place-items-center">
          <quest.Node onClear={onClear} onFail={onFail} />
        </div>
      )}
      {quest.type === 'key' && (
        <div className="p-16PX grid place-items-center text-4xl">
          <p>
            {quest.modifiers?.map((modifier) => (
              <span key={modifier}>
                <kbd>{MODIFIER_LABELS[modifier]}</kbd>+
              </span>
            ))}
            <kbd>{quest.key}</kbd>
          </p>
        </div>
      )}
      <p
        key={questIndex}
        className={clsx([
          'pr-16PX pb-2PX relative text-right',
          shouldDisableAnimation === false && [
            styles.timeBar,
            'after:bg-accent after:h-3PX after:absolute after:bottom-0 after:left-0 after:w-full',
          ],
          remainingMs !== null ? 'visible' : 'invisible',
        ])}
        style={{ '--x-duration': quest.timeLimit !== undefined ? `${quest.timeLimit}ms` : undefined } as CSSProperties}
      >
        ⌚︎ 残り：<span className="font-sans tabular-nums">{formatRemaining(remainingMs ?? 0)}</span>秒
      </p>
    </>
  );
};
