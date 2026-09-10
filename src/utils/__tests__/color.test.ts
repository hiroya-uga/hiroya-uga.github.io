import { describe, expect, it } from 'vitest';

import { convertHexToRgb, convertHslToHex, convertRgbToHsl } from '@/utils/color';

describe('convertHexToRgb', () => {
  it('#付きのhexをrgbに変換する', () => {
    expect(convertHexToRgb('#ff0000')).toStrictEqual([255, 0, 0]);
  });

  it('#なしのhexをrgbに変換する', () => {
    expect(convertHexToRgb('00ff00')).toStrictEqual([0, 255, 0]);
  });
});

describe('convertRgbToHsl', () => {
  it('rgbを0-1にスケールしたhslに変換する', () => {
    const [h, s, l] = convertRgbToHsl([255, 0, 0]);

    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(1);
    expect(l).toBeCloseTo(0.5);
  });
});

describe('convertHslToHex', () => {
  it('0-1のhslを#付きhexに変換する', () => {
    expect(convertHslToHex([0, 1, 0.5])).toBe('#FF0000');
  });
});

describe('rgb -> hsl -> hexの往復', () => {
  it('convertHexToRgbしてconvertRgbToHslした結果をconvertHslToHexすると元のhexに戻る（大文字小文字は無視）', () => {
    const original = '#3366cc';
    const [r, g, b] = convertHexToRgb(original);
    const hsl = convertRgbToHsl([r, g, b]);

    expect(convertHslToHex(hsl).toLowerCase()).toBe(original);
  });
});
