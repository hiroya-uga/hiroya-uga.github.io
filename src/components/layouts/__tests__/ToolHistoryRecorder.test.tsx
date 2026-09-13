import { beforeEach, describe, expect, it } from 'vitest';

import { getLocalStorage } from '@/utils/local-storage';
import { isToolPagePathname, writeHistoryToStorage } from '../ToolHistoryRecorder';

beforeEach(() => {
  localStorage.clear();
});

describe('isToolPagePathname', () => {
  it('/tools/配下のpathnameはtrueを返す', () => {
    expect(isToolPagePathname('/tools/css-units')).toBe(true);
  });

  it('/tools/自体はfalseを返す', () => {
    expect(isToolPagePathname('/tools/')).toBe(false);
  });

  it('/tools/配下でないpathnameはfalseを返す', () => {
    expect(isToolPagePathname('/games/sudoku')).toBe(false);
  });
});

describe('writeHistoryToStorage', () => {
  it('末尾スラッシュを除去して履歴に保存する', () => {
    writeHistoryToStorage('/tools/css-units/');

    const history = getLocalStorage('recent-tools');
    expect(history?.map((entry) => entry.pathname)).toStrictEqual(['/tools/css-units']);
    expect(history?.[0]?.count).toBe(1);
    expect(typeof history?.[0]?.lastAccessedAt).toBe('string');
  });

  it('既存の履歴の先頭に新しいpathnameを積む', () => {
    writeHistoryToStorage('/tools/css-units');
    writeHistoryToStorage('/tools/sort-visualizer');

    expect(getLocalStorage('recent-tools')?.map((entry) => entry.pathname)).toStrictEqual([
      '/tools/sort-visualizer',
      '/tools/css-units',
    ]);
  });

  it('既に履歴にあるpathnameは重複させず先頭に移動し、アクセス回数を積算する', () => {
    writeHistoryToStorage('/tools/css-units');
    writeHistoryToStorage('/tools/sort-visualizer');
    writeHistoryToStorage('/tools/css-units');

    const history = getLocalStorage('recent-tools');
    expect(history?.map((entry) => entry.pathname)).toStrictEqual(['/tools/css-units', '/tools/sort-visualizer']);
    expect(history?.[0]?.count).toBe(2);
    expect(history?.[1]?.count).toBe(1);
  });

  it('履歴は最大6件までで、古いものから溢れる', () => {
    for (let i = 0; i < 7; i++) {
      writeHistoryToStorage(`/tools/item-${i}`);
    }

    expect(getLocalStorage('recent-tools')?.map((entry) => entry.pathname)).toStrictEqual([
      '/tools/item-6',
      '/tools/item-5',
      '/tools/item-4',
      '/tools/item-3',
      '/tools/item-2',
      '/tools/item-1',
    ]);
  });
});
