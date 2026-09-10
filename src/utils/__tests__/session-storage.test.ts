import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';

beforeEach(() => {
  sessionStorage.clear();
});

describe('setSessionStorage', () => {
  it('値をそのまま保存する', () => {
    setSessionStorage('welcome-message-viewed', 'true');

    expect(sessionStorage.getItem('welcome-message-viewed')).toBe('true');
  });

  it('保存に失敗しても例外を投げずエラーログを出す', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => setSessionStorage('welcome-message-viewed', 'true')).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe('getSessionStorage', () => {
  it('未保存のキーはnullを返す', () => {
    expect(getSessionStorage('welcome-message-viewed')).toBeNull();
  });

  it('setSessionStorageで保存した値を復元する', () => {
    setSessionStorage('reading-message-viewed', 'true');

    expect(getSessionStorage('reading-message-viewed')).toBe('true');
  });

  it('読み取りに失敗した場合はnullを返しエラーログを出す', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('access denied');
    });

    expect(getSessionStorage('welcome-message-viewed')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    getItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
