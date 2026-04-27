import { describe, expect, test } from 'vitest';

import { convertHexToRgb } from '@/utils/color';
import { calcContrastRatio, findAccessibleColor, getLuminance } from '../../../client/ContrastChecker/utils';

describe('ContrastChecker utils', () => {
  test('returns the original color when the target ratio is already satisfied', () => {
    expect(
      findAccessibleColor({
        hexColor: '#111111',
        otherHex: '#ffffff',
        targetRatio: 4.5,
      }),
    ).toBe('#111111');
  });

  test('returns a suggested color that satisfies the requested contrast ratio', () => {
    const suggestedColor = findAccessibleColor({
      hexColor: '#777777',
      otherHex: '#ffffff',
      targetRatio: 4.5,
    });

    expect(suggestedColor).not.toBeNull();
    expect(suggestedColor).not.toBe('#777777');

    if (suggestedColor == null) {
      throw new Error('Expected a suggested color');
    }

    const suggestedRgbColor = convertHexToRgb(suggestedColor);
    const backgroundRgbColor = convertHexToRgb('#ffffff');
    const contrastRatio = calcContrastRatio(getLuminance(suggestedRgbColor), getLuminance(backgroundRgbColor));

    expect(4.5 <= contrastRatio).toBe(true);
  });

  test('returns null when the requested ratio is impossible by lightness-only adjustment', () => {
    expect(
      findAccessibleColor({
        hexColor: '#777777',
        otherHex: '#777777',
        targetRatio: 7,
      }),
    ).toBeNull();
  });
});
