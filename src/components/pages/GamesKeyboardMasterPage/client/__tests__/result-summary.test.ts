import { describe, expect, it } from 'vitest';

import {
  buildShareText,
  formatDuration,
  formatSeconds,
  getRankTitle,
  isBetterRecord,
  summarizeResults,
} from '../result-summary';
import type { QuestResult } from '../types';

const createResult = ({ result, elapsedMs }: Pick<QuestResult, 'result' | 'elapsedMs'>): QuestResult => ({
  quest: { type: 'key', key: ' ', title: '', hint: '', explanation: '', Node: () => null },
  source: () => ({ type: 'key', key: ' ', title: '', hint: '', explanation: '', Node: () => null }),
  result,
  elapsedMs,
  inputKeys: [],
});

describe('summarizeResults', () => {
  it('結果が空なら、すべて 0 で最も遅いお題は null', () => {
    expect(summarizeResults([])).toStrictEqual({ total: 0, successCount: 0, failCount: 0, totalMs: 0, slowest: null });
  });

  it('成功数・失敗数・合計時間を数える', () => {
    const summary = summarizeResults([
      createResult({ result: 'success', elapsedMs: 1000 }),
      createResult({ result: 'fail', elapsedMs: 2500 }),
      createResult({ result: 'success', elapsedMs: 500 }),
    ]);

    expect(summary.total).toBe(3);
    expect(summary.successCount).toBe(2);
    expect(summary.failCount).toBe(1);
    expect(summary.totalMs).toBe(4000);
  });

  it('最も時間がかかったお題を返す', () => {
    const slowest = createResult({ result: 'fail', elapsedMs: 2500 });
    const summary = summarizeResults([
      createResult({ result: 'success', elapsedMs: 1000 }),
      slowest,
      createResult({ result: 'success', elapsedMs: 500 }),
    ]);

    expect(summary.slowest).toBe(slowest);
  });
});

describe('getRankTitle', () => {
  it('全問クリアはキーボードマスター', () => {
    expect(getRankTitle({ successCount: 10, total: 10 })).toBe('キーボードマスター');
  });

  it('8割以上は達人、5割以上は中堅、それ未満は見習い', () => {
    expect(getRankTitle({ successCount: 8, total: 10 })).toBe('達人');
    expect(getRankTitle({ successCount: 5, total: 10 })).toBe('中堅');
    expect(getRankTitle({ successCount: 4, total: 10 })).toBe('見習い');
  });

  it('お題が 0 問のときは見習い', () => {
    expect(getRankTitle({ successCount: 0, total: 0 })).toBe('見習い');
  });
});

describe('isBetterRecord', () => {
  const best = { successCount: 10, total: 20, totalMs: 60000 };

  it('記録がなければ更新する', () => {
    expect(isBetterRecord({ current: best, best: null })).toBe(true);
  });

  it('クリア数が多ければ、遅くても更新する', () => {
    expect(isBetterRecord({ current: { ...best, successCount: 11, totalMs: 90000 }, best })).toBe(true);
  });

  it('クリア数が少なければ、早くても更新しない', () => {
    expect(isBetterRecord({ current: { ...best, successCount: 9, totalMs: 30000 }, best })).toBe(false);
  });

  it('クリア数が同じなら、早いときだけ更新する', () => {
    expect(isBetterRecord({ current: { ...best, totalMs: 59999 }, best })).toBe(true);
    expect(isBetterRecord({ current: { ...best }, best })).toBe(false);
  });

  it('お題の数が違う古い記録は捨てて更新する', () => {
    expect(isBetterRecord({ current: { successCount: 1, total: 25, totalMs: 99999 }, best })).toBe(true);
  });
});

describe('formatSeconds / formatDuration', () => {
  it('秒を小数第1位まで出す', () => {
    expect(formatSeconds(1234)).toBe('1.2秒');
  });

  it('負の値は 0 秒にする', () => {
    expect(formatSeconds(-500)).toBe('0.0秒');
  });

  it('1分未満は秒だけ、1分以上は分と秒を出す', () => {
    expect(formatDuration(45000)).toBe('45.0秒');
    expect(formatDuration(151000)).toBe('2分31秒');
  });
});

describe('buildShareText', () => {
  it('クリア数・称号・所要時間・URL を改行区切りで返す', () => {
    const summary = { total: 20, successCount: 17, failCount: 3, totalMs: 151000, slowest: null };

    expect(buildShareText({ summary, url: 'https://example.com/games/keyboard-master' })).toBe(
      'キーボードマスター：20問中17問クリア（達人）\nかかった時間：2分31秒\nhttps://example.com/games/keyboard-master',
    );
  });
});
