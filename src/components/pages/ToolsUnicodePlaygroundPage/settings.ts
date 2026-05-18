import { getStringMetrics } from '@/utils/unicode';

import { SPECIFIC_CODEPOINTS } from './utils';

export const defaultValue = '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}';

type SuggestItem = { ja: string; en: string; value: string; valueEn?: string };

const suggestItems: SuggestItem[] = [
  // U+1F468 + ZWJ + U+1F469 + ZWJ + U+1F467 + ZWJ + U+1F466
  { ja: 'ZWJ結合の4人家族', en: 'Family: ZWJ sequence (4 members)', value: defaultValue },
  // U+2764 + U+FE0F + U+200D + U+1F525
  { ja: 'ZWJ複合絵文字1', en: 'ZWJ compound emoji 1', value: '\u2764\uFE0F\u200D\u{1F525}' },
  // U+2764 + U+FE0F + U+200D + U+1FA79
  { ja: 'ZWJ複合絵文字2', en: 'ZWJ compound emoji 2', value: '\u2764\uFE0F\u200D\u{1FA79}' },
  // U+1F1EF + U+1F1F5
  { ja: 'Regional Indicator 2文字', en: 'Regional Indicator (2 chars)', value: '\u{1F1EF}\u{1F1F5}' },
  // U+0023 + U+FE0F + U+20E3
  {
    ja: 'キーキャップ絵文字。ASCII+VS16+結合文字',
    en: 'Keycap emoji: ASCII + VS16 + combining',
    value: '#\uFE0F\u20E3',
  },
  // U+29E3D
  { ja: 'BMP外漢字・サロゲートペア', en: 'CJK outside BMP (surrogate pair)', value: '\u{29E3D}' },
  // JA: U+304C「が」 / EN: U+00E9「é」
  { ja: 'ただの「が」', en: 'Simple é (precomposed)', value: '\u304C', valueEn: '\u00E9' },
  // JA: U+304B + U+3099（か + 結合濁点） / EN: U+0065 + U+0301（e + combining acute）
  {
    ja: '分解形（か＋結合濁点）',
    en: 'Decomposed: e + combining acute',
    value: '\u304B\u3099',
    valueEn: '\u0065\u0301',
  },
  // JA: U+3042「あ」 / EN: U+0061「a」
  { ja: 'ただの「あ」', en: 'Simple a', value: '\u3042', valueEn: '\u0061' },
  // JA: U+3042 + U+200D x9 / EN: U+0061 + U+200D x9
  {
    ja: '見た目は1文字・実際は10コードポイント',
    en: 'Looks like 1 char, actually 10 code points',
    value: '\u3042\u200D\u200D\u200D\u200D\u200D\u200D\u200D\u200D\u200D',
    valueEn: '\u0061\u200D\u200D\u200D\u200D\u200D\u200D\u200D\u200D\u200D',
  },
  // U+FFFD
  { ja: '置換文字 REPLACEMENT CHARACTER', en: 'Replacement Character', value: '\uFFFD' },

  (() => {
    // datalist>option要素のvalue属性に含められない制御文字。
    const forbiddenInOptionValue = new Set([0x000a, 0x000d, 0x007f, 0x0085]);
    const specificEntries = Object.entries(SPECIFIC_CODEPOINTS).filter(
      ([codepoint]) => forbiddenInOptionValue.has(Number(codepoint)) === false,
    );
    const specificCharsValue = specificEntries.map(([codepoint]) => String.fromCodePoint(Number(codepoint))).join('');
    const specificCharsLabels = specificEntries.map(([, { abbr }]) => abbr);

    return {
      ja: `特殊文字一覧 ${specificCharsLabels.join('・')}`,
      en: `Special chars: ${specificCharsLabels.join(', ')}`,
      value: specificCharsValue,
    };
  })(),
];

const toJaOption = ({ ja, value }: SuggestItem) => {
  const { codepointCount, utf8Bytes } = getStringMetrics(value);
  return { label: `${ja}（${codepointCount}コードポイント・${utf8Bytes}バイト）`, value };
};

const toEnOption = ({ en, value, valueEn }: SuggestItem) => {
  const actualValue = valueEn ?? value;
  const { codepointCount, utf8Bytes } = getStringMetrics(actualValue);
  return { label: `${en} (${codepointCount} code points · ${utf8Bytes} bytes)`, value: actualValue };
};

export const unicodeSuggest = suggestItems.map(toJaOption);

export const unicodeSuggestEn = suggestItems.map(toEnOption);
