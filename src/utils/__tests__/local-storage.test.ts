import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';

beforeEach(() => {
  localStorage.clear();
});

describe('setLocalStorage', () => {
  it('オブジェクトの値はそのままJSON化して保存する', () => {
    setLocalStorage('home', { 'power-section-viewed-at': '2026-09-10' });

    expect(localStorage.getItem('home')).toBe(JSON.stringify({ 'power-section-viewed-at': '2026-09-10' }));
  });

  it('プリミティブな値はtype情報を付けてJSON化して保存する', () => {
    setLocalStorage('theme', 'dark');

    expect(localStorage.getItem('theme')).toBe(JSON.stringify({ type: 'primitive', value: 'dark' }));
  });

  it('localStorageへの保存に失敗しても例外を投げずエラーログを出す', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => setLocalStorage('theme', 'dark')).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe('getLocalStorage', () => {
  it('未保存のキーはnullを返す', () => {
    expect(getLocalStorage('theme')).toBeNull();
  });

  it('setLocalStorageで保存したプリミティブな値を復元する', () => {
    setLocalStorage('theme', 'dark');

    expect(getLocalStorage('theme')).toBe('dark');
  });

  it('setLocalStorageで保存したオブジェクトの値を復元する', () => {
    setLocalStorage('home', { 'power-section-viewed-at': '2026-09-10' });

    expect(getLocalStorage('home')).toStrictEqual({ 'power-section-viewed-at': '2026-09-10' });
  });

  it('不正なJSONが保存されている場合はnullを返しエラーログを出す', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorage.setItem('theme', '{invalid json');

    expect(getLocalStorage('theme')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  describe('withRaw: true を指定した場合', () => {
    it('生の文字列とパース済みの値を両方返す', () => {
      setLocalStorage('home', { 'power-section-viewed-at': '2026-09-10' });

      expect(getLocalStorage('home', { withRaw: true })).toStrictEqual({
        raw: JSON.stringify({ 'power-section-viewed-at': '2026-09-10' }),
        parsed: { 'power-section-viewed-at': '2026-09-10' },
      });
    });

    it('未保存のキーはrawがnull、parsedもnullを返す', () => {
      expect(getLocalStorage('home', { withRaw: true })).toStrictEqual({
        raw: null,
        parsed: null,
      });
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
