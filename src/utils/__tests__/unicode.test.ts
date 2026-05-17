import { describe, expect, it } from 'vitest';

import { decodeUnicodeEscapes, getStringMetrics, toHex } from '@/utils/unicode';

describe('toHex', () => {
  it('4桁以下は U+XXXX 形式にゼロ埋めする', () => {
    expect(toHex(0x0000)).toBe('U+0000');
    expect(toHex(0x0041)).toBe('U+0041');
    expect(toHex(0xffff)).toBe('U+FFFF');
  });

  it('5桁以上はそのまま出力する', () => {
    expect(toHex(0x1f600)).toBe('U+1F600');
    expect(toHex(0x10ffff)).toBe('U+10FFFF');
  });
});

describe('decodeUnicodeEscapes', () => {
  it('\\uXXXX 形式をデコードする', () => {
    expect(decodeUnicodeEscapes('\\u0041')).toBe('A');
    expect(decodeUnicodeEscapes('\\u3042')).toBe('あ');
  });

  it('\\u{XXXXX} 形式をデコードする', () => {
    expect(decodeUnicodeEscapes('\\u{1F600}')).toBe('😀');
    expect(decodeUnicodeEscapes('\\u{1F468}\\u200D\\u{1F469}')).toBe('\u{1F468}‍\u{1F469}');
  });

  it('エスケープを含まない文字列はそのまま返す', () => {
    expect(decodeUnicodeEscapes('hello')).toBe('hello');
    expect(decodeUnicodeEscapes('')).toBe('');
  });

  it('通常テキストとエスケープが混在していてもデコードする', () => {
    expect(decodeUnicodeEscapes('hello \\u0041')).toBe('hello A');
  });

  it('U+10FFFF を超えるコードポイントはエスケープ文字列のまま残す', () => {
    expect(decodeUnicodeEscapes('\\u{110000}')).toBe('\\u{110000}');
  });
});

describe('getStringMetrics', () => {
  it('空文字列はすべて 0 になる', () => {
    expect(getStringMetrics('')).toStrictEqual({
      utf16Length: 0,
      utf8Bytes: 0,
      codepointCount: 0,
      graphemeCount: 0,
    });
  });

  it('ASCII 1文字: 各値が 1', () => {
    expect(getStringMetrics('A')).toStrictEqual({
      utf16Length: 1,
      utf8Bytes: 1,
      codepointCount: 1,
      graphemeCount: 1,
    });
  });

  it('3バイト文字（あ）: UTF-16=1, UTF-8=3, CP=1, grapheme=1', () => {
    expect(getStringMetrics('あ')).toStrictEqual({
      utf16Length: 1,
      utf8Bytes: 3,
      codepointCount: 1,
      graphemeCount: 1,
    });
  });

  it('BMP 外の絵文字（😀 U+1F600）: UTF-16=2（サロゲートペア）, UTF-8=4, CP=1, grapheme=1', () => {
    expect(getStringMetrics('😀')).toStrictEqual({
      utf16Length: 2,
      utf8Bytes: 4,
      codepointCount: 1,
      graphemeCount: 1,
    });
  });

  it('ZWJ 結合絵文字: CP 数と .length は増えるが grapheme は 1', () => {
    // U+1F468 + ZWJ + U+1F469 + ZWJ + U+1F467 + ZWJ + U+1F466
    const family = '\u{1F468}‍\u{1F469}‍\u{1F467}‍\u{1F466}';
    expect(getStringMetrics(family)).toStrictEqual({
      utf16Length: 11,
      utf8Bytes: 25,
      codepointCount: 7,
      graphemeCount: 1,
    });
  });

  it('結合文字（か + 結合濁点 = が）: CP=2, grapheme=1', () => {
    const decomposed = 'が';
    expect(getStringMetrics(decomposed)).toStrictEqual({
      utf16Length: 2,
      utf8Bytes: 6,
      codepointCount: 2,
      graphemeCount: 1,
    });
  });
});
