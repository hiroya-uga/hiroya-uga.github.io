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

  return isVisible ? <span className="animate-fade-in">{`ヒント：${hint}`}</span> : null;
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
    setTimeout(() => {
      ref.current?.focus({ preventScroll: true });
      ref.current?.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }, 0);
  }, [questIndex]);

  return (
    <div
      className="absolute inset-0 grid size-full grid-rows-[auto_1fr_auto]"
      onClick={(e) => {
        if (e.detail === 0) {
          return;
        }

        e.preventDefault();

        if (ref.current !== document.activeElement && ref.current?.contains(document.activeElement)) {
          onFail();
        }

        ref.current?.focus();
      }}
      onKeyDown={(e) => {
        if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }

        switch (e.key) {
          case ' ':
            if (
              (e.target instanceof HTMLButtonElement === false && e.target instanceof HTMLInputElement === false) ||
              (e.target instanceof HTMLInputElement && e.target.type === 'range')
            ) {
              e.preventDefault();
            }
            break;

          case 'ArrowUp':
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'ArrowDown':
            if (e.target instanceof HTMLInputElement) {
              if (e.target.type === 'range' || e.target.type === 'text') {
                return;
              }

              if (
                e.target.type === 'radio' &&
                1 < e.currentTarget.querySelectorAll(`input[name="${e.target.name}"]`).length
              ) {
                return;
              }
            }
            e.preventDefault();
            break;
        }
      }}
    >
      <h2 className="bg-secondary p-16PX sticky top-0" id={id}>
        {`お題：${quest.title}`}
      </h2>

      <div className="p-8PX scrollbar-gutter-both grid items-center overflow-auto">
        <div
          ref={ref}
          role="region"
          aria-labelledby={id}
          tabIndex={-1}
          className="p-8PX grid aspect-video place-items-center -outline-offset-2"
        >
          {quest.type === 'node' && <quest.Node onClear={onClear} onFail={onFail} />}
          {quest.type === 'key' && (
            <p className="text-4xl">
              <quest.Node />
            </p>
          )}
        </div>
      </div>
      <div
        key={questIndex}
        className={clsx([
          'sticky bottom-0 grid min-h-[3lh] items-end',
          shouldEnableAnimation &&
            shouldEnableTimeLimit && [
              styles.timeBar,
              'after:bg-accent after:h-3PX after:absolute after:bottom-0 after:left-0 after:w-full',
            ],
        ])}
        style={{ '--x-duration': quest.timeLimit !== undefined ? `${quest.timeLimit}ms` : undefined } as CSSProperties}
      >
        <div className="px-8PX pb-2PX bg-secondary border-t-primary grid grid-cols-[1fr_auto] items-end gap-[1em] border-t text-sm">
          <p role="status">
            <QuestHint hint={quest.hint} />
          </p>
          <p className={clsx([remainingMs !== null ? 'visible' : 'invisible'])}>
            残り：<span className="font-sans tabular-nums">{formatRemaining(remainingMs ?? 0)}</span>秒
          </p>
        </div>
      </div>
    </div>
  );
};
