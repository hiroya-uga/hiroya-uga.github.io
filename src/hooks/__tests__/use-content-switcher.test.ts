import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useContentSwitcher } from '@/hooks/use-content-switcher';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';

const LANGUAGES = ['zsh', 'js'];

beforeEach(() => {
  localStorage.clear();
});

describe('useContentSwitcher', () => {
  it('platformでkeysを省略したとき、macOSを選択した状態になる', () => {
    const { result } = renderHook(() => useContentSwitcher('platform'));

    expect(result.current[0]).toBe('macOS');
  });

  it('keysの先頭が初期値になる', () => {
    const { result } = renderHook(() => useContentSwitcher('language', LANGUAGES));

    expect(result.current[0]).toBe('zsh');
  });

  it('platformの保存値があるとき、それを選択した状態になる', () => {
    setLocalStorage('platform', 'Windows');

    const { result } = renderHook(() => useContentSwitcher('platform'));

    expect(result.current[0]).toBe('Windows');
  });

  it('languageの保存値があるとき、それを選択した状態になる', () => {
    setLocalStorage('code-language', 'js');

    const { result } = renderHook(() => useContentSwitcher('language', LANGUAGES));

    expect(result.current[0]).toBe('js');
  });

  it('保存値がkeysに含まれないとき、初期値のままになる', () => {
    setLocalStorage('code-language', 'bash');

    const { result } = renderHook(() => useContentSwitcher('language', LANGUAGES));

    expect(result.current[0]).toBe('zsh');
  });

  it('typeごとに別のキーで保存する', () => {
    setLocalStorage('platform', 'Windows');

    const { result } = renderHook(() => useContentSwitcher('language', LANGUAGES));

    expect(result.current[0]).toBe('zsh');
  });

  it('handleChangeを呼ぶと選択が切り替わり、typeに対応するキーへ保存する', () => {
    const { result } = renderHook(() => useContentSwitcher('language', LANGUAGES));

    act(() => {
      result.current[1]('js');
    });

    expect(result.current[0]).toBe('js');
    expect(getLocalStorage('code-language')).toBe('js');
    expect(getLocalStorage('platform')).toBeNull();
  });

  it('同じtypeの別インスタンスにも選択が伝わる', () => {
    const first = renderHook(() => useContentSwitcher('platform'));
    const second = renderHook(() => useContentSwitcher('platform'));

    act(() => {
      first.result.current[1]('Windows');
    });

    expect(second.result.current[0]).toBe('Windows');
  });

  it('別のtypeのインスタンスには選択が伝わらない', () => {
    const platform = renderHook(() => useContentSwitcher('platform', ['a', 'b']));
    const language = renderHook(() => useContentSwitcher('language', ['a', 'b']));

    act(() => {
      platform.result.current[1]('b');
    });

    expect(language.result.current[0]).toBe('a');
  });

  it('自分のkeysに含まれない値は、他のインスタンスから伝わっても無視する', () => {
    const first = renderHook(() => useContentSwitcher('language', LANGUAGES));
    const second = renderHook(() => useContentSwitcher('language', ['curl', 'fetch']));

    act(() => {
      first.result.current[1]('js');
    });

    expect(second.result.current[0]).toBe('curl');
  });

  it('アンマウント後はイベントを受け取らない', () => {
    const first = renderHook(() => useContentSwitcher('platform'));
    const second = renderHook(() => useContentSwitcher('platform'));

    second.unmount();

    act(() => {
      first.result.current[1]('Windows');
    });

    expect(second.result.current[0]).toBe('macOS');
  });
});
