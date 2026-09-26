'use client';

import { arrayShuffle } from '@/utils/array-shuffle';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEscapeHold, useKeyboardMasterConfig } from './hooks';
import styles from './KeyboardMasterChallengeClient.module.css';
import { EscapeHoldOverlay, IdleScreen, PlayingScreen, ResultScreen } from './parts';
import { QUESTS } from './quests';
import type { Mode, Pulse, QuestResult } from './types';

export const KeyboardMasterChallengeClient = () => {
  const advanceTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const [quests, setQuests] = useState(QUESTS);
  const [mode, setMode] = useState<Mode>('idle');
  const [questIndex, setQuestIndex] = useState(0);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [shouldFocusStart, setShouldFocusStart] = useState(false);
  const { config, updateFlags } = useKeyboardMasterConfig();

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
    };
  }, []);

  const handleAbort = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    setPulse(null);
    setQuestIndex(0);
    // プレイ画面ごと消えるので、フォーカスが落ちないよう開始ボタンへ移す
    setShouldFocusStart(true);
    setMode('idle');
  }, []);

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

  // ランダム出題は設定が有効なときだけ。読み込み後に設定が変わりうるので、開始のたびに決める
  const pickQuests = useCallback(() => (config.flags.random ? arrayShuffle(QUESTS) : QUESTS), [config.flags.random]);

  const handleStart = useCallback(() => {
    setQuests(pickQuests());
    setShouldFocusStart(false);
    setMode('playing');
  }, [pickQuests]);

  // 結果画面の Retry ボタンごと消えるので、フォーカスが落ちないよう開始ボタンへ移す
  const handleRetry = useCallback(() => {
    setQuests(pickQuests());
    setPulse(null);
    setQuestIndex(0);
    setShouldFocusStart(true);
    setMode('idle');
  }, [pickQuests]);

  const handleClear = useCallback(() => advance('success'), [advance]);
  const handleFail = useCallback(() => advance('fail'), [advance]);

  const { isHolding } = useEscapeHold({ isActive: mode === 'playing', onAbort: handleAbort });

  return (
    <div className="absolute inset-0 grid size-full overflow-hidden rounded border">
      {mode === 'idle' && (
        <IdleScreen
          config={config}
          shouldFocusStart={shouldFocusStart}
          onChangeFlags={updateFlags}
          onStart={handleStart}
        />
      )}
      {mode === 'clear' && (
        <ResultScreen results={results} shouldEnableAnimation={config.flags.animation} onRetry={handleRetry} />
      )}
      {mode === 'playing' && (
        <PlayingScreen
          quest={quests[questIndex]}
          questIndex={questIndex}
          shouldEnableTimeLimit={config.flags.timeLimit}
          shouldEnableAnimation={config.flags.animation}
          onClear={handleClear}
          onFail={handleFail}
        />
      )}
      {isHolding && <EscapeHoldOverlay shouldEnableAnimation={config.flags.animation} />}
      <p aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 grid">
        {pulse !== null && (
          <span
            key={pulse.id}
            className={clsx([
              'grid place-items-center text-2xl font-bold',
              config.flags.animation ? styles.pulse : styles.pulseInstant,
              pulse.result === 'success' ? 'bg-success' : 'bg-error',
            ])}
          >
            {pulse.result === 'success' ? 'Success!' : 'Failed!'}
          </span>
        )}
      </p>
    </div>
  );
};
