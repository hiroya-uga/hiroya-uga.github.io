'use client';

import { arrayShuffle } from '@/utils/array-shuffle';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEscapeHold, useFocusTrap } from './hooks';
import { Game } from './parts';
import { QUESTS } from './quests';
import type { Mode, Pulse, QuestResult } from './types';

export const KeyboardMasterChallengeClient = () => {
  const ref = useRef<HTMLDivElement>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const [quests, setQuests] = useState(() => arrayShuffle(QUESTS));
  const [mode, setMode] = useState<Mode>('idle');
  const [questIndex, setQuestIndex] = useState(0);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [results, setResults] = useState<QuestResult[]>([]);

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

  useEffect(() => {
    if (mode !== 'clear') {
      return;
    }

    ref.current?.focus();
  }, [mode]);

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

    // 押したボタンが消えてフォーカスが body に落ちるため、結果画面と同じくコンテナへ戻す
    queueMicrotask(() => {
      ref.current?.focus();
    });
  }, []);

  const handleClear = useCallback(() => advance('success'), [advance]);
  const handleFail = useCallback(() => advance('fail'), [advance]);

  const isPlaying = mode === 'playing';

  useFocusTrap({ containerRef: ref, isActive: isPlaying });
  useEscapeHold({ isActive: isPlaying, onAbort: handleAbort });

  return (
    <div className="relative aspect-video rounded" role="group" aria-label="ゲーム画面">
      <div
        ref={ref}
        tabIndex={-1}
        className={clsx([
          'absolute inset-0 size-full rounded border',
          mode === 'playing' && 'pointer-events-none grid cursor-none grid-rows-[auto_1fr_auto]',
        ])}
      >
        <Game
          mode={mode}
          quests={quests}
          questIndex={questIndex}
          pulse={pulse}
          results={results}
          onStart={() => setMode('playing')}
          onRetry={handleRetry}
          onClear={handleClear}
          onFail={handleFail}
        />
      </div>
    </div>
  );
};
