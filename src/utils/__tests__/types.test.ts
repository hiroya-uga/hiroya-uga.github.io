import { describe, expect, it } from 'vitest';

import { hasItems, nonNullable } from '@/utils/types';

describe('nonNullable', () => {
  it('undefinedはfalseを返す', () => {
    expect(nonNullable(undefined)).toBe(false);
  });

  it('nullはfalseを返す', () => {
    expect(nonNullable(null)).toBe(false);
  });

  it('0はtrueを返す', () => {
    expect(nonNullable(0)).toBe(true);
  });

  it('空文字はtrueを返す', () => {
    expect(nonNullable('')).toBe(true);
  });

  it('値ありはtrueを返す', () => {
    expect(nonNullable('value')).toBe(true);
  });
});

describe('hasItems', () => {
  it('空配列はfalseを返す', () => {
    expect(hasItems([])).toBe(false);
  });

  it('要素が1つの配列はtrueを返す', () => {
    expect(hasItems([1])).toBe(true);
  });

  it('要素が複数の配列はtrueを返す', () => {
    expect(hasItems([1, 2, 3])).toBe(true);
  });

  it('nullはfalseを返す', () => {
    expect(hasItems(null)).toBe(false);
  });

  it('undefinedはfalseを返す', () => {
    expect(hasItems(undefined)).toBe(false);
  });
});
