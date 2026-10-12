'use client';

import { GAME_ROOT_ID, MODIFIER_LABELS } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { isKeyboardActivatedClick } from '@/utils/keyboard';
import clsx from 'clsx';
import { type CSSProperties, memo, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useFocusTrap, useKeyQuest, useQuestTimer } from '../hooks';
import type { Quest } from '../quests';
import type { FailAttempt, QuestAttempt, QuestFailReason } from '../types';
import styles from './PlayingScreen.module.css';

interface Props {
  quest: Quest;
  questIndex: number;
  shouldEnableTimeLimit: boolean;
  shouldEnableAnimation: boolean;
  onClear: (attempt: QuestAttempt) => void;
  onFail: (attempt: FailAttempt) => void;
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
    shiftKey && key !== 'Shift' && MODIFIER_LABELS.shiftKey,
    ctrlKey && key !== 'Control' && MODIFIER_LABELS.ctrlKey,
    altKey && key !== 'Alt' && MODIFIER_LABELS.altKey,
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

// 1秒ごとのカウントダウン更新を親から切り離し、入力履歴やヒントを含む兄弟サブツリーの再レンダーを避ける
const QuestTimer = ({
  quest,
  isEnabled,
  onTimeout,
}: Readonly<{ quest: Quest; isEnabled: boolean; onTimeout: () => void }>) => {
  const remainingMs = useQuestTimer({ isEnabled, quest, onTimeout });

  return (
    <p className={clsx([remainingMs !== null ? 'visible' : 'invisible'])}>
      残り：<span className="font-sans tabular-nums">{formatRemaining(remainingMs ?? 0)}</span>秒
    </p>
  );
};

// 入力履歴やヒントの更新(毎キー入力)で約35種あるクエスト本体まで再レンダーされないよう、必要な props だけで親から切り離す
const QuestStage = memo(
  ({
    quest,
    pressedKeys,
    onClear,
    onFail,
  }: Readonly<{
    quest: Quest;
    pressedKeys: ReadonlySet<string>;
    onClear: () => void;
    onFail: () => void;
  }>) => (
    <>
      {quest.type === 'node' && <quest.Node onClear={onClear} onFail={onFail} />}
      {quest.type === 'key' && (
        <p className="text-4xl">
          <quest.Node pressedKeys={pressedKeys} />
        </p>
      )}
    </>
  ),
);

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
  // 表示用の inputKeys は決着後に空にするうえ、React の onKeyDown は window の keydown より先に走るため、
  // 決着の瞬間に最後のキーまで含めて結果へ渡せるよう、お題ごとの履歴を同期的に更新できる ref で別に持つ
  const attemptKeysRef = useRef<string[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const setTimeoutIdRef = useRef(-1);
  const clearInputTimeoutIdRef = useRef(-1);
  useFocusTrap({ containerRef: ref });

  // 最後に押したキーが履歴に見えるよう、クリア直後ではなく少し遅らせて空にする。node 型・key 型のどちらでも共通
  // useKeyQuest の keydown リスナー再登録を避けるため identity を固定する
  const handleClear = useCallback(() => {
    onClear({ inputKeys: attemptKeysRef.current });
    window.clearTimeout(clearInputTimeoutIdRef.current);
    clearInputTimeoutIdRef.current = window.setTimeout(() => {
      setInputKeys([]);
    }, 400);
  }, [onClear]);

  // useQuestTimer は onTimeout が変わるとカウントダウンを最初からやり直すので、identity を固定する
  const handleFail = useCallback(
    (reason: QuestFailReason) => {
      onFail({ reason, inputKeys: attemptKeysRef.current });
    },
    [onFail],
  );
  const handleTimeout = useCallback(() => handleFail('timeout'), [handleFail]);
  // お題側は onMouseDown={onFail} のようにイベントを引数で渡すことがあるので、引数を捨てて理由を固定する
  // QuestStage を memo 化した意味がなくなるため、identity を固定する
  const handleNodeFail = useCallback(() => handleFail('wrong-operation'), [handleFail]);

  const { pressedKeys } = useKeyQuest({ quest, onClear: handleClear, onFail: handleFail });

  useEffect(() => {
    attemptKeysRef.current = [];
    // 直前のお題で予約された「入力履歴を空にする」タイマーが、次のお題に持ち越されて誤発火しないようにする
    window.clearTimeout(clearInputTimeoutIdRef.current);
  }, [questIndex]);

  useEffect(() => {
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
      window.clearTimeout(setTimeoutIdRef.current);
    };
  }, []);

  return (
    <div
      className={clsx([
        styles.root,
        'absolute inset-0 grid size-full grid-rows-[auto_auto_1fr_auto]',
        isCursorHidden && 'cursor-none',
      ])}
      onClick={(e) => {
        if (isKeyboardActivatedClick(e)) {
          return;
        }

        e.preventDefault();

        if (ref.current !== document.activeElement && ref.current?.contains(document.activeElement)) {
          handleFail('mouse');
        }

        ref.current?.focus();
      }}
      // お題側は自前の onKeyDown で即座に onFail を呼ぶことがあり、bubble 側で履歴を追記すると
      // その呼び出しより後になって失敗の原因になったキーが履歴から漏れる。capture 側で先に記録する。
      onKeyDownCapture={(e) => {
        if (e.repeat === false) {
          const keyCombo = formatKeyCombo(e);
          setInputKeys((prev) => [...prev, keyCombo].slice(-INPUT_HISTORY_LIMIT));
          attemptKeysRef.current = [...attemptKeysRef.current, keyCombo].slice(-INPUT_HISTORY_LIMIT);
        }
      }}
      onKeyDown={(e) => {
        if (quest.type === 'key') {
          e.preventDefault();
          return;
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
      <div className="bg-secondary p-16PX sticky top-0 flex items-center justify-between">
        <h2 id={id}>{`お題：${quest.title}`}</h2>
        <p className="text-10px">{`No. ${String(questIndex + 1).padStart(2, '0')}`}</p>
      </div>

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
            <QuestStage quest={quest} pressedKeys={pressedKeys} onClear={handleClear} onFail={handleNodeFail} />
          </div>
        </div>
      </div>
      <div
        key={questIndex}
        className={clsx([
          'sticky bottom-0 grid min-h-[3lh] items-end',
          shouldEnableAnimation &&
            shouldEnableTimeLimit && [
              styles.bar,
              'after:bg-accent after:h-3PX after:absolute after:bottom-0 after:left-0 after:w-full',
            ],
        ])}
        style={{ '--x-duration': quest.timeLimit !== undefined ? `${quest.timeLimit}ms` : undefined } as CSSProperties}
      >
        <div className="px-12PX py-8PX bg-secondary border-t-primary grid grid-cols-[1fr_auto] items-end gap-[1em] border-t text-sm">
          <p role="status">
            <QuestHint hint={quest.hint} />
          </p>
          <QuestTimer quest={quest} isEnabled={shouldEnableTimeLimit} onTimeout={handleTimeout} />
        </div>
      </div>
    </div>
  );
};
