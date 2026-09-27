import { describe, expect, it } from 'vitest';

import { resolveAttemptPlan } from '../attempt-plan';
import { QUESTS } from '../quests';

describe('resolveAttemptPlan', () => {
  it('1回目は固定のFIRSTセットを、ランダムを強制せず返す', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 1, questCount: 10, isRandomEnabled: false });

    expect(plan).toStrictEqual({ sources: QUESTS.first, shouldEnableRandom: false });
  });

  it('2回目は固定のSECONDセットを、ランダムを強制せず返す', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 2, questCount: 10, isRandomEnabled: true });

    expect(plan).toStrictEqual({ sources: QUESTS.second, shouldEnableRandom: false });
  });

  it('3回目以降は、ALLからquestCount問をランダムに選ぶ', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 3, questCount: 10, isRandomEnabled: false });

    expect(plan.sources).toHaveLength(10);
    expect(new Set(plan.sources).size).toBe(10);
    plan.sources.forEach((source) => {
      expect(QUESTS.all).toContain(source);
    });
  });

  it('3回目以降にquestCountがALL全体を超えていても、重複なくALLの範囲に収まる', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 4, questCount: QUESTS.all.length, isRandomEnabled: true });

    expect(plan.sources).toHaveLength(QUESTS.all.length);
    expect(new Set(plan.sources).size).toBe(QUESTS.all.length);
  });

  it('3回目以降でランダムが無効なら、有効化を要求する', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 3, questCount: 10, isRandomEnabled: false });

    expect(plan.shouldEnableRandom).toBe(true);
  });

  it('3回目以降でランダムが既に有効なら、有効化を要求しない', () => {
    const plan = resolveAttemptPlan({ attemptNumber: 3, questCount: 10, isRandomEnabled: true });

    expect(plan.shouldEnableRandom).toBe(false);
  });
});

describe('QUESTS', () => {
  it('1・2回目は固定の10問ずつに絞られている', () => {
    expect(QUESTS.first).toHaveLength(10);
    expect(QUESTS.second).toHaveLength(10);
  });

  it('ALLは1・2回目のセットをすべて含む', () => {
    [...QUESTS.first, ...QUESTS.second].forEach((source) => {
      expect(QUESTS.all).toContain(source);
    });
  });
});
