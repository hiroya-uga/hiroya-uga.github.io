'use client';

import { arrayShuffle } from '@/utils/array-shuffle';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEscapeHold, useKeyboardMasterConfig } from './hooks';
import styles from './KeyboardMasterChallengeClient.module.css';
import { IdleScreen, PlayingScreen, ResultScreen } from './parts';
import { QUESTS } from './quests';
import type { Mode, Pulse, QuestResult } from './types';

export const KeyboardMasterChallengeClient = () => {
  const advanceTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const [quests, setQuests] = useState(() => arrayShuffle(QUESTS));
  const [mode, setMode] = useState<Mode>('idle');
  const [questIndex, setQuestIndex] = useState(0);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [results, setResults] = useState<QuestResult[]>([]);
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
    };
  }, []);

  const handleAbort = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    setPulse(null);
    setQuestIndex(0);
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

  const handleRetry = useCallback(() => {
    setQuests(arrayShuffle(QUESTS));
    setPulse(null);
    setQuestIndex(0);
    setMode('playing');
  }, []);

  const handleClear = useCallback(() => advance('success'), [advance]);
  const handleFail = useCallback(() => advance('fail'), [advance]);

  useEscapeHold({ isActive: mode === 'playing', onAbort: handleAbort });

  return (
    <div className="absolute inset-0 grid size-full overflow-hidden rounded border">
      {mode === 'idle' && (
        <IdleScreen config={config} onChangeConfig={updateConfig} onStart={() => setMode('playing')} />
      )}
      {mode === 'clear' && (
        <ResultScreen results={results} shouldDisableAnimation={config.shouldDisableAnimation} onRetry={handleRetry} />
      )}
      {mode === 'playing' && (
        <PlayingScreen
          quest={quests[questIndex]}
          questIndex={questIndex}
          shouldDisableTimeLimit={config.shouldDisableTimeLimit}
          shouldDisableAnimation={config.shouldDisableAnimation}
          onClear={handleClear}
          onFail={handleFail}
        />
      )}
      <p role="status" className="pointer-events-none absolute inset-0 z-10 grid">
        {pulse !== null && (
          <span
            key={pulse.id}
            className={clsx([
              'grid place-items-center text-2xl font-bold',
              config.shouldDisableAnimation ? styles.pulseInstant : styles.pulse,
              pulse.result === 'success' ? 'bg-primary' : 'bg-error',
            ])}
          >
            {pulse.result === 'success' ? 'Success!' : 'Failed!'}
          </span>
        )}
      </p>
    </div>
  );
};
