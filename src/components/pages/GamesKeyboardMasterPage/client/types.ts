import type { Quest, QuestSource } from './quests';

export type Mode = 'idle' | 'playing' | 'clear';

export interface Pulse {
  id: number;
  result: 'success' | 'fail';
}

export type FailReason = 'timeout' | 'wrong-key' | 'mouse' | 'wrong-operation';

/** お題の決着時にプレイ画面から渡す、そのお題の間に押したキーの履歴 */
export interface QuestAttempt {
  inputKeys: string[];
}

export interface FailAttempt extends QuestAttempt {
  reason: FailReason;
}

export interface QuestResult {
  quest: Quest;
  // ランダム値を持つお題を「失敗した問題だけやり直す」ときに作り直せるよう、解決前の定義も持つ
  source: QuestSource;
  result: 'success' | 'fail';
  reason?: FailReason;
  elapsedMs: number;
  inputKeys: string[];
}

/** 全問プレイしたときの自己ベスト */
export interface BestRecord {
  successCount: number;
  total: number;
  totalMs: number;
}
