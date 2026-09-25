'use client';

import { arrayShuffle } from '@/utils/array-shuffle';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useKeyboardMasterConfig } from './hooks';
import { Game } from './parts';
import { MODIFIER_KEYS, QUESTS } from './quests';
import type { Mode, Pulse, QuestResult } from './types';

const ESCAPE_HOLD_DURATION = 3000;
const MODIFIER_SINGLE_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

export const KeyboardMasterChallengeClient = () => {
  const ref = useRef<HTMLDivElement>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const escapeHoldTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const [quests, setQuests] = useState(() => arrayShuffle(QUESTS));
  const [mode, setMode] = useState<Mode>('idle');
  const [questIndex, setQuestIndex] = useState(0);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const { config, updateConfig } = useKeyboardMasterConfig();

  useEffect(() => {
    resolvedRef.current = false;
  }, [mode, questIndex]);

  useEffect(() => {
    if (mode === 'playing') {
      setResults([]);
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }

      if (escapeHoldTimeoutRef.current !== null) {
        window.clearTimeout(escapeHoldTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== 'playing') {
      return;
    }

    ref.current?.focus();

    const handleFocus = () => {
      if (ref.current?.contains(document.activeElement)) {
        return;
      }
      ref.current?.querySelector<HTMLElement>('[role="status"]')?.focus();
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('focusin', handleFocus);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== 'clear') {
      return;
    }

    ref.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (mode !== 'playing') {
      return;
    }

    const clearHoldTimeout = () => {
      if (escapeHoldTimeoutRef.current === null) {
        return;
      }

      window.clearTimeout(escapeHoldTimeoutRef.current);
      escapeHoldTimeoutRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 長押し判定なので keydown の連続発火(e.repeat)ではタイマーを張り直さない
      if (e.key !== 'Escape' || e.repeat || escapeHoldTimeoutRef.current !== null) {
        return;
      }

      escapeHoldTimeoutRef.current = window.setTimeout(() => {
        if (advanceTimeoutRef.current !== null) {
          window.clearTimeout(advanceTimeoutRef.current);
          advanceTimeoutRef.current = null;
        }

        setPulse(null);
        setQuestIndex(0);
        setMode('idle');
      }, ESCAPE_HOLD_DURATION);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      clearHoldTimeout();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearHoldTimeout();
    };
  }, [mode]);

  const advance = useCallback(
    (result: Pulse['result']) => {
      if (resolvedRef.current) {
        return;
      }

      resolvedRef.current = true;
      setPulse((current) => ({ id: (current?.id ?? 0) + 1, result }));
      setResults((current) => [...current, { quest: quests[questIndex], result }]);

      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }

      // successPop が不透明で覆っている間(20%〜80% = 160ms〜640ms)に進めて切り替わりを隠す
      advanceTimeoutRef.current = window.setTimeout(() => {
        setQuestIndex((current) => {
          if (current + 1 >= quests.length) {
            setMode('clear');
            return current;
          }

          return current + 1;
        });
      }, 400);
    },
    [quests, questIndex],
  );

  const handleRetry = useCallback(() => {
    setQuests(arrayShuffle(QUESTS));
    setPulse(null);
    setQuestIndex(0);
    setMode('playing');

    // 押したボタンが消えてフォーカスが body に落ちるため、結果画面と同じくコンテナへ戻す
    queueMicrotask(() => {
      ref.current?.focus();
    });
  }, []);

  const handleClear = useCallback(() => advance('success'), [advance]);
  const handleFail = useCallback(() => advance('fail'), [advance]);

  useEffect(() => {
    if (mode !== 'playing') {
      return;
    }

    const quest = quests[questIndex];

    if (quest.type !== 'key') {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const requiredModifiers = quest.modifiers ?? [];
      const modifiersMatch = MODIFIER_KEYS.every((modifier) => requiredModifiers.includes(modifier) === e[modifier]);

      if (e.key === quest.key && modifiersMatch) {
        // Shift+Tab のようなブラウザ標準動作を持つ組み合わせがフォーカストラップを壊さないよう止める
        e.preventDefault();
        handleClear();
        return;
      }

      // 修飾キー単体はコンボの途中操作、Escape は長押し中断機能と競合するため Fail 判定から除外する
      if (MODIFIER_SINGLE_KEYS.has(e.key) || e.key === 'Escape') {
        return;
      }

      handleFail();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, questIndex, quests, handleClear, handleFail]);

  useEffect(() => {
    if (mode !== 'playing') {
      setRemainingMs(null);
      return;
    }

    const timeLimit = quests[questIndex].timeLimit;

    if (timeLimit === undefined || config.shouldDisableTimeLimit) {
      setRemainingMs(null);
      return;
    }

    const deadline = Date.now() + timeLimit;
    setRemainingMs(timeLimit);

    const interval = window.setInterval(() => {
      setRemainingMs(Math.max(0, deadline - Date.now()));
    }, 200);

    const timeout = window.setTimeout(() => {
      handleFail();
    }, timeLimit);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [mode, questIndex, quests, config.shouldDisableTimeLimit, handleFail]);

  return (
    <div className="relative aspect-video rounded">
      <div
        ref={ref}
        tabIndex={-1}
        className={clsx([
          'absolute inset-0 size-full overflow-auto rounded border',
          mode === 'playing' && 'pointer-events-none grid cursor-none grid-rows-[auto_1fr_auto]',
        ])}
      >
        <Game
          mode={mode}
          quests={quests}
          questIndex={questIndex}
          pulse={pulse}
          results={results}
          remainingMs={remainingMs}
          config={config}
          onChangeConfig={updateConfig}
          onStart={() => setMode('playing')}
          onRetry={handleRetry}
          onClear={handleClear}
          onFail={handleFail}
        />
      </div>
    </div>
  );
};
