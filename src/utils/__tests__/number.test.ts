import { describe, expect, it } from 'vitest';

import { parseInteger } from '@/utils/number';

describe('parseInteger', () => {
  it('半角数字の文字列を数値に変換する', () => {
    expect(parseInteger('123')).toBe(123);
  });

  it('全角数字の文字列を半角化して数値に変換する', () => {
    expect(parseInteger('１２３')).toBe(123);
  });

  it('全角と半角が混在する文字列を数値に変換する', () => {
    expect(parseInteger('１2３')).toBe(123);
  });

  it('先頭の0を除去して数値に変換する', () => {
    expect(parseInteger('007')).toBe(7);
  });

  it('数字以外の文字を除去して数値に変換する', () => {
    expect(parseInteger('1a2b3')).toBe(123);
  });

  it('負の数を数値に変換する', () => {
    expect(parseInteger('-42')).toBe(-42);
  });

  it('空文字はNaNを返す', () => {
    expect(parseInteger('')).toBeNaN();
  });

  it('数字を含まない文字列はNaNを返す', () => {
    expect(parseInteger('abc')).toBeNaN();
  });
});
