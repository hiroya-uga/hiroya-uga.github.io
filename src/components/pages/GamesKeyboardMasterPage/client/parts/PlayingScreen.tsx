'use client';

import { GAME_ROOT_ID } from '@/components/pages/GamesKeyboardMasterPage/constants';
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
const INPUT_HISTORY_LIMIT = 30;

// 修飾キー単体を押したときに「Shift+Shift」と出ないよう、押したキー自身は修飾側から除く
const formatKeyCombo = ({
  key,
  shiftKey,
  ctrlKey,
  altKey,
}: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'altKey'>) => {
  const modifiers = [
    shiftKey && key !== 'Shift' && 'Shift',
    ctrlKey && key !== 'Control' && 'Ctrl',
    altKey && key !== 'Alt' && 'Alt',
  ].filter(Boolean);

  return [...modifiers, key === ' ' ? 'Space' : key].join(' + ');
};

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
  const [isCursorHidden, setIsCursorHidden] = useState(true);
  const [inputKeys, setInputKeys] = useState<string[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const setTimeoutIdRef = useRef(-1);
  useFocusTrap({ containerRef: ref });
  useKeyQuest({ quest, onClear, onFail });
  const remainingMs = useQuestTimer({
    isEnabled: shouldEnableTimeLimit,
    quest,
    onTimeout: onFail,
  });

  useEffect(() => {
    setInputKeys([]);
    setTimeout(() => {
      ref.current?.focus({ preventScroll: true });
      document.getElementById(GAME_ROOT_ID)?.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }, 0);
  }, [questIndex]);

  useEffect(() => {
    const onPointerMove = () => {
      setIsCursorHidden(false);
      clearTimeout(setTimeoutIdRef.current);

      setTimeoutIdRef.current = window.setTimeout(() => {
        setIsCursorHidden(true);
      }, 1000);
    };

    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div
      className={clsx([
        'absolute inset-0 grid size-full grid-rows-[auto_auto_1fr_auto]',
        isCursorHidden && 'cursor-none',
      ])}
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
        if (e.repeat === false) {
          const keyCombo = formatKeyCombo(e);
          setInputKeys((prev) => [...prev, keyCombo].slice(-INPUT_HISTORY_LIMIT));
        }

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
          case 'Home':
          case 'End':
          case 'PageUp':
          case 'PageDown':
            if (e.target instanceof HTMLInputElement) {
              if (
                e.target.type === 'text' ||
                e.target.type === 'range' ||
                e.target.type === 'number' ||
                e.target.type === 'datetime-local'
              ) {
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

      <div className="pt-2PX relative overflow-hidden after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-[20%] after:bg-[linear-gradient(to_right,transparent,var(--x-color-background-primary))]">
        <ol className="px-8PX min-h-30px flex w-max text-nowrap" aria-label="入力履歴">
          {inputKeys.toReversed().map((key, index) => (
            <li key={`${key}${index}`} className="not-last:after:px-1 not-last:after:content-['←']">
              <kbd className="min-w-[1lh] text-center">{key}</kbd>
            </li>
          ))}
        </ol>
      </div>

      <div
        className={clsx([
          'relative min-h-0',
          'has-[[role="region"]:focus-visible]:after:outline-(--color-link,red) has-[[role="region"]:focus-visible]:after:pointer-events-none has-[[role="region"]:focus-visible]:after:absolute has-[[role="region"]:focus-visible]:after:inset-0 has-[[role="region"]:focus-visible]:after:outline-2 has-[[role="region"]:focus-visible]:after:-outline-offset-8',
        ])}
      >
        <div className="p-8PX scrollbar-gutter-both grid size-full items-center overflow-auto">
          <div
            ref={ref}
            role="region"
            aria-labelledby={id}
            tabIndex={-1}
            className="p-8PX grid aspect-video place-items-center shadow-none outline-none"
          >
            {quest.type === 'node' && <quest.Node onClear={onClear} onFail={onFail} />}
            {quest.type === 'key' && (
              <p className="text-4xl">
                <quest.Node />
              </p>
            )}
          </div>
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
