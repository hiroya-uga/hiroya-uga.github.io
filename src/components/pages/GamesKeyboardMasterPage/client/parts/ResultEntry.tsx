import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { FAIL_REASON_LABELS, formatSeconds } from '../result-summary';
import type { QuestResult } from '../types';

interface Props {
  entry: QuestResult;
  // 出題順の番号(0 始まり)。失敗を先頭に並べ替えても元の問題番号が分かるようにする
  index: number;
  // 表示順。フェードインの遅延に使う
  order: number;
  shouldEnableAnimation: boolean;
  shouldEnableTimeLimit: boolean;
}

const MAX_STAGGER_STEPS = 12;

export const ResultEntry = ({ entry, index, order, shouldEnableAnimation, shouldEnableTimeLimit }: Readonly<Props>) => {
  const { quest, result, reason, elapsedMs, inputKeys } = entry;
  const isSuccess = result === 'success';
  const remainingMs =
    isSuccess && shouldEnableTimeLimit && quest.timeLimit !== undefined ? quest.timeLimit - elapsedMs : null;

  return (
    <li
      className={clsx(['border-primary rounded border', shouldEnableAnimation && 'animate-fade-in opacity-0'])}
      style={{ animationDelay: `${Math.min(order, MAX_STAGGER_STEPS) * 60}ms` } as CSSProperties}
    >
      {/* 失敗したお題は最初から開き、成功したお題は畳んで一覧性を保つ */}
      <details open={isSuccess === false}>
        <summary className="p-16PX flex cursor-pointer flex-wrap items-center gap-2 font-bold">
          <span
            className={clsx(['px-8PX inline-block rounded text-sm font-normal', isSuccess ? 'bg-success' : 'bg-error'])}
          >
            {isSuccess ? 'Success' : 'Failed'}
          </span>
          <span>{`第${String(index + 1).padStart(2, '0')}問：${quest.title}`}</span>
        </summary>
        <div className="px-16PX pb-16PX space-y-2 text-sm">
          <p className="text-secondary">{quest.explanation}</p>
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            {reason !== undefined && (
              <div className="flex gap-1">
                <dt>失敗の理由：</dt>
                <dd>{FAIL_REASON_LABELS[reason]}</dd>
              </div>
            )}
            <div className="flex gap-1">
              <dt>かかった時間：</dt>
              <dd>{formatSeconds(elapsedMs)}</dd>
            </div>
            {remainingMs !== null && (
              <div className="flex gap-1">
                <dt>制限時間の余り：</dt>
                <dd>{formatSeconds(remainingMs)}</dd>
              </div>
            )}
          </dl>
          {0 < inputKeys.length && (
            <div className="flex flex-wrap items-baseline gap-1">
              <p>押したキー：</p>
              <ol className="flex flex-wrap gap-1" aria-label="押したキーの履歴">
                {inputKeys.map((key, keyIndex) => (
                  <li key={`${key}${keyIndex}`} className="not-last:after:px-1 not-last:after:content-['→']">
                    <kbd className="min-w-[1lh] text-center">{key}</kbd>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </details>
    </li>
  );
};
