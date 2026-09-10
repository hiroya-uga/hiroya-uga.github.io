import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useThemeChange } from '@/hooks/use-theme-change';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({ matches: false }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error テスト用に追加したプロパティを消す
  delete window.matchMedia;
});

describe('useThemeChange', () => {
  it('保存済みのthemeがあればそれを採用する', async () => {
    localStorage.setItem('theme', JSON.stringify({ type: 'primitive', value: 'dark' }));

    const { result } = renderHook(() => useThemeChange());

    await waitFor(() => expect(result.current.theme).toBe('dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('保存済みのthemeがなければmatchMediaの結果をlocalStorageに保存する', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const { result } = renderHook(() => useThemeChange());

    await waitFor(() => expect(result.current.theme).toBe('dark'));
    expect(localStorage.getItem('theme')).toBe(JSON.stringify({ type: 'primitive', value: 'dark' }));
  });

  it('changeThemeはdata-theme属性とlocalStorageを更新する', async () => {
    const { result } = renderHook(() => useThemeChange());

    await waitFor(() => expect(result.current.theme).not.toBeNull());

    act(() => {
      result.current.changeTheme('dark');
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe(JSON.stringify({ type: 'primitive', value: 'dark' }));
  });

  it('changeThemeはstorageイベントを発火し、themeの状態を更新する', async () => {
    const { result } = renderHook(() => useThemeChange());

    await waitFor(() => expect(result.current.theme).not.toBeNull());

    act(() => {
      result.current.changeTheme('dark');
    });

    await waitFor(() => expect(result.current.theme).toBe('dark'));
  });
});
