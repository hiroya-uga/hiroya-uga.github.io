import type { KeyboardMasterBestRecord, QuestFailReason, QuestResult } from './types';

export const FAIL_REASON_LABELS: Record<QuestFailReason, string> = {
  timeout: '時間切れ',
  'wrong-key': '違うキーを押した',
  mouse: 'マウスでクリックした',
  'wrong-operation': '操作を間違えた',
};

interface ResultSummary {
  total: number;
  successCount: number;
  failCount: number;
  totalMs: number;
  slowest: QuestResult | null;
}

export const summarizeResults = (results: QuestResult[]): ResultSummary => {
  const { successCount, totalMs, slowest } = results.reduce(
    (acc, entry) => ({
      successCount: acc.successCount + (entry.result === 'success' ? 1 : 0),
      totalMs: acc.totalMs + entry.elapsedMs,
      slowest: acc.slowest === null || acc.slowest.elapsedMs < entry.elapsedMs ? entry : acc.slowest,
    }),
    { successCount: 0, totalMs: 0, slowest: null as QuestResult | null },
  );

  return {
    total: results.length,
    successCount,
    failCount: results.length - successCount,
    totalMs,
    slowest,
  };
};

export const getRankTitle = ({ successCount, total }: Pick<ResultSummary, 'successCount' | 'total'>) => {
  const ratio = total === 0 ? 0 : successCount / total;

  if (ratio === 1) {
    return 'キーボードマスター';
  }

  if (0.8 <= ratio) {
    return '達人';
  }

  if (0.5 <= ratio) {
    return '中堅';
  }

  return '見習い';
};

/**
 * 自己ベストを更新するか。クリア数が多いほうを優先し、同数なら早いほうを取る。
 * お題の数が変わった記録とは比べようがないので、お題数が違うときは古い記録を捨てて更新扱いにする。
 */
export const isBetterRecord = ({
  current,
  best,
}: {
  current: KeyboardMasterBestRecord;
  best: KeyboardMasterBestRecord | null;
}) => {
  if (best === null || best.total !== current.total) {
    return true;
  }

  if (best.successCount !== current.successCount) {
    return best.successCount < current.successCount;
  }

  return current.totalMs < best.totalMs;
};

export const formatSeconds = (ms: number) => `${(Math.max(0, ms) / 1000).toFixed(1)}秒`;

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);

  return minutes === 0 ? formatSeconds(ms) : `${minutes}分${String(totalSeconds % 60).padStart(2, '0')}秒`;
};

export const buildShareText = ({ summary, url }: { summary: ResultSummary; url: string }) =>
  [
    `キーボードマスター：${summary.total}問中${summary.successCount}問クリア（${getRankTitle(summary)}）`,
    `かかった時間：${formatDuration(summary.totalMs)}`,
    url,
  ].join('\n');
