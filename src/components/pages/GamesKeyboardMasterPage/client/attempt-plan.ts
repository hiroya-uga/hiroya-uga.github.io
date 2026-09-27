import { arrayShuffle } from '@/utils/array-shuffle';
import type { QuestSource } from './quests';
import { QUESTS } from './quests';

export type AttemptPlanInput = {
  // これから始める「全問プレイ」が何回目かを表す1始まりの番号
  attemptNumber: number;
  questCount: number;
  isRandomEnabled: boolean;
};

export type AttemptPlan = {
  sources: QuestSource[];
  // 3回目以降は操作に慣れた前提でランダム出題を強制する。オフのままなら設定側を書き換える必要があることを表す
  shouldEnableRandom: boolean;
};

/**
 * 1・2回目は固定の10問を順番どおりに、3回目以降は全問からランダムに questCount 問を出題する
 */
export const resolveAttemptPlan = ({ attemptNumber, questCount, isRandomEnabled }: AttemptPlanInput): AttemptPlan => {
  if (attemptNumber === 1) {
    return { sources: QUESTS.first, shouldEnableRandom: false };
  }

  if (attemptNumber === 2) {
    return { sources: QUESTS.second, shouldEnableRandom: false };
  }

  return {
    sources: arrayShuffle(QUESTS.all).slice(0, questCount),
    shouldEnableRandom: isRandomEnabled === false,
  };
};
