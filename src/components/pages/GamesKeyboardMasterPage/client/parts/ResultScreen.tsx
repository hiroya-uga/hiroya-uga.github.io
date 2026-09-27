'use client';

import { Toast } from '@/components/ui/dialogs/Toast';
import clsx from 'clsx';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useCountUp } from '../hooks';
import {
  buildShareText,
  formatDuration,
  formatSeconds,
  getRankTitle,
  isBetterRecord,
  summarizeResults,
} from '../result-summary';
import type { KeyboardMasterBestRecord, QuestResult } from '../types';
import { Confetti } from './Confetti';
import { ResultEntry } from './ResultEntry';
import styles from './ResultScreen.module.css';

interface Props {
  results: QuestResult[];
  // 失敗した問題だけのやり直しは問題数が違うので、自己ベストの対象にしない
  isFullRun: boolean;
  // ちょうど2回目をクリアした直後かどうかの判定に使う
  tryCount: number;
  bestRecord: KeyboardMasterBestRecord | null;
  shouldEnableAnimation: boolean;
  shouldEnableTimeLimit: boolean;
  onRecordBest: (record: KeyboardMasterBestRecord) => void;
  onRetry: () => void;
  onRetryFailed: () => void;
}

const buttonClassName = 'bg-secondary border-primary rounded border px-6 py-2';

export const ResultScreen = ({
  results,
  isFullRun,
  tryCount,
  bestRecord,
  shouldEnableAnimation,
  shouldEnableTimeLimit,
  onRecordBest,
  onRetry,
  onRetryFailed,
}: Readonly<Props>) => {
  const id = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState('');
  // 記録の更新は結果画面の表示中に走るので、更新前の値を覚えておいて比較と表示に使う
  const [previousBest] = useState(bestRecord);

  const summary = useMemo(() => summarizeResults(results), [results]);
  const record = useMemo<KeyboardMasterBestRecord>(
    () => ({ successCount: summary.successCount, total: summary.total, totalMs: summary.totalMs }),
    [summary],
  );
  const isNewBest = isFullRun && isBetterRecord({ current: record, best: previousBest });
  const isAllSuccess = 0 < summary.total && summary.failCount === 0;
  const animatedSuccessCount = useCountUp({ target: summary.successCount, isEnabled: shouldEnableAnimation });

  // ref コールバックだと再描画のたびに走り、フィルターのチェックボックスからフォーカスを奪うので、表示時に1回だけ移す
  useEffect(() => {
    scrollRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isNewBest) {
      onRecordBest(record);
    }
  }, [isNewBest, record, onRecordBest]);

  // 失敗を先頭に並べる。元の問題番号は index で持ち回る
  const entries = useMemo(() => {
    const indexed = results.map((entry, index) => ({ entry, index }));
    const failed = indexed.filter(({ entry }) => entry.result === 'fail');
    const succeeded = indexed.filter(({ entry }) => entry.result === 'success');

    return [...failed, ...succeeded];
  }, [results]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        buildShareText({ summary, url: `${window.location.origin}${window.location.pathname}` }),
      );
      setToastMessage('結果をコピーしました。');
    } catch {
      setToastMessage('コピーできませんでした。');
    }
  };

  return (
    <>
      {isAllSuccess && shouldEnableAnimation && <Confetti />}
      <section className="flex max-h-full w-full flex-col overflow-hidden" aria-labelledby={id}>
        <div
          ref={scrollRef}
          tabIndex={0}
          className={clsx([
            'p-16PX grow overflow-auto -outline-offset-4',
            shouldEnableAnimation && 'animate-fade-in opacity-0',
          ])}
        >
          <h2 id={id} className="mb-4 text-center text-2xl font-bold">
            結果発表
          </h2>

          {isFullRun && tryCount === 2 && (
            <p className={clsx(['bg-success mb-4 text-center tracking-wider', styles.pulse])}>
              <strong>ランダム出題が解放されました！</strong>
            </p>
          )}

          <div className="border-primary p-16PX mb-4 rounded border">
            <p className="text-lg font-bold">{getRankTitle(summary)}</p>
            <p className="text-4xl font-bold">
              <span aria-hidden="true" className="font-sans tabular-nums">
                {`${animatedSuccessCount}/${summary.total}問クリア！`}
              </span>
              <span className="sr-only">{`${summary.successCount}/${summary.total}問クリア`}</span>
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex gap-1">
                <dt>合計時間：</dt>
                <dd>{formatDuration(summary.totalMs)}</dd>
              </div>
              {summary.slowest !== null && (
                <div className="flex gap-1">
                  <dt>いちばん時間がかかったお題：</dt>
                  <dd>{`${summary.slowest.quest.title}（${formatSeconds(summary.slowest.elapsedMs)}）`}</dd>
                </div>
              )}
              {isFullRun && (
                <div className="flex gap-1">
                  <dt>自己ベスト：</dt>
                  <dd>
                    {previousBest === null && '初めての記録です'}
                    {previousBest !== null && isNewBest && '自己ベストを更新しました'}
                    {previousBest !== null &&
                      isNewBest === false &&
                      `${previousBest.successCount}問クリア（${formatDuration(previousBest.totalMs)}）`}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <ul className="space-y-3">
            {entries.map(({ entry, index }, order) => (
              <ResultEntry
                key={index}
                entry={entry}
                index={index}
                order={order}
                shouldEnableAnimation={shouldEnableAnimation}
                shouldEnableTimeLimit={shouldEnableTimeLimit}
              />
            ))}
          </ul>
        </div>

        <div className="bg-secondary border-t-primary px-16PX py-8PX border-t">
          <p className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className={buttonClassName} onClick={onRetry}>
              Retry
            </button>
            {0 < summary.failCount && (
              <button type="button" className={buttonClassName} onClick={onRetryFailed}>
                失敗した問題だけやり直す
              </button>
            )}
            <button type="button" className={buttonClassName} onClick={handleCopy}>
              結果をコピー
            </button>
          </p>
        </div>
      </section>
      <Toast message={toastMessage} setMessage={setToastMessage} duration={2000} />
    </>
  );
};
