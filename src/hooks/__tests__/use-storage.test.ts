import { renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLocalStorage } from '@/hooks/use-storage';

beforeEach(() => {
  localStorage.clear();
});

const Probe = () => {
  const { isReady, value } = useLocalStorage('theme');

  return `${isReady}:${value}`;
};

describe('useLocalStorage', () => {
  it('オブジェクト値はlocalStorageの生の値が変わらない限り同じ参照を返す', () => {
    localStorage.setItem('achievement', JSON.stringify({ foo: true }));

    const { result, rerender } = renderHook(() => useLocalStorage('achievement'));
    const first = result.current.value;
    rerender();

    expect(result.current.value).toBe(first);
  });

  it('localStorageの生の値が変わると新しい値を返す', () => {
    localStorage.setItem('achievement', JSON.stringify({ foo: true }));

    const { result, rerender } = renderHook(() => useLocalStorage('achievement'));
    localStorage.setItem('achievement', JSON.stringify({ foo: false }));
    rerender();

    expect(result.current.value).toStrictEqual({ foo: false });
  });

  it('値が無い場合はnullを返す', () => {
    const { result } = renderHook(() => useLocalStorage('theme'));

    expect(result.current).toStrictEqual({ isReady: true, value: null });
  });

  it('サーバー描画では isReady が false で value は null になる', () => {
    localStorage.setItem('theme', JSON.stringify({ type: 'primitive', value: 'dark' }));

    const html = renderToString(createElement(Probe));

    expect(html).toBe('false:null');
  });

  it('customGetSnapshotが値を返せばそれを優先する', () => {
    localStorage.setItem('theme', JSON.stringify({ type: 'primitive', value: 'light' }));

    const { result } = renderHook(() => useLocalStorage('theme', { getSnapshot: () => 'dark' }));

    expect(result.current.value).toBe('dark');
  });
});
