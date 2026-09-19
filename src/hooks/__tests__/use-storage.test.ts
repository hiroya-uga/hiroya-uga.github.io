import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLocalStorage } from '@/hooks/use-storage';

beforeEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('オブジェクト値はlocalStorageの生の値が変わらない限り同じ参照を返す', () => {
    localStorage.setItem('achievement', JSON.stringify({ foo: true }));

    const { result, rerender } = renderHook(() => useLocalStorage('achievement'));
    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });

  it('localStorageの生の値が変わると新しい値を返す', () => {
    localStorage.setItem('achievement', JSON.stringify({ foo: true }));

    const { result, rerender } = renderHook(() => useLocalStorage('achievement'));
    localStorage.setItem('achievement', JSON.stringify({ foo: false }));
    rerender();

    expect(result.current).toStrictEqual({ foo: false });
  });

  it('値がnullの場合はdefaultValueにフォールバックする', () => {
    const { result } = renderHook(() => useLocalStorage('theme', { defaultValue: 'light' }));

    expect(result.current).toBe('light');
  });

  it('customGetSnapshotがnullを返してもdefaultValueにフォールバックする', () => {
    const { result } = renderHook(() => useLocalStorage('theme', { getSnapshot: () => null, defaultValue: 'light' }));

    expect(result.current).toBe('light');
  });

  it('customGetSnapshotが値を返せばそれを優先する', () => {
    const { result } = renderHook(() => useLocalStorage('theme', { getSnapshot: () => 'dark', defaultValue: 'light' }));

    expect(result.current).toBe('dark');
  });
});
