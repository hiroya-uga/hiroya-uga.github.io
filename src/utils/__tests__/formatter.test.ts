import { describe, expect, it } from 'vitest';

import { formatHexString } from '@/utils/formatter';

describe('formatHexString', () => {
  it('6桁の16進数を小文字のhexカラー文字列に整形する', () => {
    expect(formatHexString('A1B2C3')).toBe('#a1b2c3');
    expect(formatHexString('#A1B2C3')).toBe('#a1b2c3');
  });

  it('3桁の16進数を6桁に展開する', () => {
    expect(formatHexString('AbC')).toBe('#aabbcc');
    expect(formatHexString('#AbC')).toBe('#aabbcc');
  });

  it('前後の空白を除去して整形する', () => {
    expect(formatHexString('  #ABCDEF  ')).toBe('#abcdef');
  });

  it('hexカラーとして不正な入力はnullを返す', () => {
    expect(formatHexString('')).toBeNull();
    expect(formatHexString('ab')).toBeNull();
    expect(formatHexString('abcd')).toBeNull();
    expect(formatHexString('xyzxyz')).toBeNull();
  });
});
