import { describe, expect, it } from 'vitest';

import { getCodepointCategory, getCodepointMeta } from '../../utils';

describe('ToolsUnicodePlaygroundPage utils', () => {
  it.each([
    { codePoint: 0x200d, expected: 'default-ignorable', label: 'ZWJ' },
    { codePoint: 0x061c, expected: 'bidi-control', label: 'Arabic Letter Mark' },
    { codePoint: 0x1f1ef, expected: 'regional-indicator', label: 'Regional Indicator' },
    { codePoint: 0xfeff, expected: 'default-ignorable', label: 'BOM' },
    { codePoint: 0x00a0, expected: 'white-space', label: 'NBSP' },
    { codePoint: 0x202f, expected: 'white-space', label: 'Narrow No-Break Space' },
    { codePoint: 0x202e, expected: 'bidi-control', label: 'Bidi Control' },
    { codePoint: 0x0000, expected: 'control', label: 'NULL' },
    { codePoint: 0x007f, expected: 'control', label: 'DEL' },
    { codePoint: 0x0085, expected: 'control', label: 'NEL' },
    { codePoint: 0x2007, expected: 'white-space', label: 'Figure Space' },
    { codePoint: 0x2009, expected: 'white-space', label: 'Thin Space' },
    { codePoint: 0x200a, expected: 'white-space', label: 'Hair Space' },
    { codePoint: 0x205f, expected: 'white-space', label: 'Medium Mathematical Space' },
    { codePoint: 0x3164, expected: 'default-ignorable', label: 'Hangul Filler' },
    { codePoint: 0xe0100, expected: 'variation-selector', label: 'Variation Selector' },
    { codePoint: 0x3099, expected: 'combining-mark', label: 'Combining Dakuten' },
    { codePoint: 0x1f468, expected: 'astral', label: 'Astral Emoji' },
    { codePoint: 0x3042, expected: 'other', label: 'Hiragana Letter' },
    { codePoint: 0xd800, expected: 'lone-surrogate', label: 'High Surrogate 開始' },
    { codePoint: 0xdbff, expected: 'lone-surrogate', label: 'High Surrogate 終端' },
    { codePoint: 0xdc00, expected: 'lone-surrogate', label: 'Low Surrogate 開始' },
    { codePoint: 0xdfff, expected: 'lone-surrogate', label: 'Low Surrogate 終端' },
  ])('$label を $expected に分類できる', ({ codePoint, expected }) => {
    expect(getCodepointCategory(codePoint)).toBe(expected);
  });

  describe('getCodepointMeta', () => {
    describe('categoryLabel', () => {
      it.each([
        { codePoint: 0xfffd, expected: 'SYMBOL', label: 'REPL は \\p{S} なので SYMBOL' },
        { codePoint: 0xfffc, expected: 'SYMBOL', label: 'OBJ も \\p{S} なので SYMBOL' },
        { codePoint: 0xd800, expected: 'LONE SURROGATE', label: '孤立サロゲートは LONE SURROGATE' },
        { codePoint: 0x2029, expected: 'WHITE SPACE', label: 'PSEP はカテゴリ通り WHITE SPACE' },
        { codePoint: 0x202e, expected: 'BIDI CONTROL', label: 'RLO はカテゴリ通り BIDI CONTROL' },
      ])('$label', ({ codePoint, expected }) => {
        expect(getCodepointMeta(codePoint).categoryLabel).toBe(expected);
      });
    });

    describe('noGlyph', () => {
      it.each([
        { codePoint: 0xfffd, expected: true, label: 'REPL は SPECIFIC 登録あり' },
        { codePoint: 0xfffc, expected: true, label: 'OBJ は SPECIFIC 登録あり' },
        { codePoint: 0xd800, expected: true, label: '孤立サロゲート' },
        { codePoint: 0x000a, expected: true, label: 'LF（制御文字）' },
        { codePoint: 0x007f, expected: true, label: 'DEL（制御文字）' },
        { codePoint: 0x2009, expected: true, label: 'Thin Space（white-space）' },
        { codePoint: 0x200a, expected: true, label: 'Hair Space（white-space）' },
        { codePoint: 0x3042, expected: false, label: 'ひらがな（可視）' },
        { codePoint: 0x2605, expected: false, label: '★（SPECIFIC 外の可視シンボル）' },
      ])('$label の noGlyph は $expected', ({ codePoint, expected }) => {
        expect(getCodepointMeta(codePoint).noGlyph).toBe(expected);
      });
    });
  });
});
