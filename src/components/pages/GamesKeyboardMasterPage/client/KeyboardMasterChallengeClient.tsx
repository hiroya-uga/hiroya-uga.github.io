'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveAttemptPlan } from './attempt-plan';
import { useEscapeHold, useKeyboardMasterConfig } from './hooks';
import styles from './KeyboardMasterChallengeClient.module.css';
import { EscapeHoldOverlay, IdleScreen, PlayingScreen, ResultScreen } from './parts';
import { type Quest, type QuestSource, QUESTS } from './quests';
import type { FailAttempt, Mode, QuestAttempt, QuestFailReason, QuestPulse, QuestResult } from './types';

const resolveQuests = (sources: QuestSource[]): Quest[] =>
  sources.map((source) => (typeof source === 'function' ? source() : source));

// 「失敗した問題だけやり直す」でランダム値を持つお題を作り直せるよう、解決前の定義と一緒に持つ
const createPlan = (sources: QuestSource[]) => ({ sources, quests: resolveQuests(sources) });

export const KeyboardMasterChallengeClient = () => {
  const advanceTimeoutRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const startedAtRef = useRef(0);
  const [{ sources, quests }, setPlan] = useState(() => createPlan(QUESTS.first));
  // null は全問プレイ。配列のときは、失敗したお題だけをやり直す
  const [retrySources, setRetrySources] = useState<QuestSource[] | null>(null);
  const isFullRun = retrySources === null;
  const [mode, setMode] = useState<Mode>('idle');
  const [questIndex, setQuestIndex] = useState(0);
  const [pulse, setPulse] = useState<QuestPulse | null>(null);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [shouldFocusStart, setShouldFocusStart] = useState(false);
  const { config, updateFlags, updateBest, updateTryCount, updateQuestCount } = useKeyboardMasterConfig();

  useEffect(() => {
    resolvedRef.current = false;
    startedAtRef.current = performance.now();
  }, [mode, questIndex]);

  // 3回目の解放条件(2回クリア)を満たした時点で、開始を待たずランダム出題をONにしておく
  useEffect(() => {
    if (mode === 'clear' && isFullRun && config.tryCount === 2 && config.flags.random === false) {
      updateFlags({ random: true });
    }
  }, [mode, isFullRun, config.tryCount, config.flags.random, updateFlags]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  // 結果画面・プレイ画面ごと消えるので、フォーカスが落ちないよう開始ボタンへ移す
  const backToIdle = useCallback((nextRetrySources: QuestSource[] | null) => {
    setRetrySources(nextRetrySources);
    setPulse(null);
    setQuestIndex(0);
    setShouldFocusStart(true);
    setMode('idle');
  }, []);

  const handleAbort = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    backToIdle(null);
  }, [backToIdle]);

  const advance = useCallback(
    ({
      result,
      reason,
      inputKeys,
    }: {
      result: QuestPulse['result'];
      reason?: QuestFailReason;
      inputKeys: string[];
    }) => {
      if (resolvedRef.current) {
        return;
      }

      resolvedRef.current = true;
      setPulse((current) => ({ id: (current?.id ?? 0) + 1, result }));
      const elapsedMs = Math.round(performance.now() - startedAtRef.current);
      setResults((current) => [
        ...current,
        { quest: quests[questIndex], source: sources[questIndex], result, reason, elapsedMs, inputKeys },
      ]);

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
    [quests, sources, questIndex],
  );

  // ランダム出題は設定が有効なときだけ。読み込み後に設定が変わりうるので、開始のたびに決める。
  const handleStart = useCallback(() => {
    // やり直しのお題は、直前の並びのまま出す。tryCount には数えない
    if (retrySources !== null) {
      setPlan(createPlan(retrySources));
      setResults([]);
      setShouldFocusStart(false);
      setMode('playing');
      return;
    }

    const attemptNumber = config.tryCount + 1;
    const plan = resolveAttemptPlan({
      attemptNumber,
      questCount: config.questCount,
      isRandomEnabled: config.flags.random,
    });

    if (plan.shouldEnableRandom) {
      updateFlags({ random: true });
    }

    setPlan(createPlan(plan.sources));
    setResults([]);
    updateTryCount(attemptNumber);
    setShouldFocusStart(false);
    setMode('playing');
  }, [retrySources, config.tryCount, config.flags.random, config.questCount, updateFlags, updateTryCount]);

  const handleRetry = useCallback(() => backToIdle(null), [backToIdle]);

  const handleRetryFailed = useCallback(
    () => backToIdle(results.filter((entry) => entry.result === 'fail').map((entry) => entry.source)),
    [backToIdle, results],
  );

  const handleClear = useCallback((attempt: QuestAttempt) => advance({ result: 'success', ...attempt }), [advance]);
  const handleFail = useCallback((attempt: FailAttempt) => advance({ result: 'fail', ...attempt }), [advance]);

  const { isHolding } = useEscapeHold({ isActive: mode === 'playing', onAbort: handleAbort });

  return (
    <div className={clsx([styles.root, 'absolute inset-0 grid size-full overflow-hidden rounded border'])}>
      {mode === 'idle' && (
        <IdleScreen
          config={config}
          shouldFocusStart={shouldFocusStart}
          retryCount={retrySources?.length ?? null}
          onChangeFlags={updateFlags}
          onChangeQuestCount={updateQuestCount}
          onClearRetry={() => setRetrySources(null)}
          onStart={handleStart}
        />
      )}
      {mode === 'clear' && (
        <ResultScreen
          results={results}
          isFullRun={isFullRun}
          tryCount={config.tryCount}
          bestRecord={config.best}
          shouldEnableAnimation={config.flags.animation}
          shouldEnableTimeLimit={config.flags.timeLimit}
          onRecordBest={updateBest}
          onRetry={handleRetry}
          onRetryFailed={handleRetryFailed}
        />
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
              styles.pulse,
              config.flags.animation === false && styles.instant,
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
