import { Lang } from '@/types/lang';
import { toHex } from '@/utils/unicode';

import { unicodePlaygroundLocales } from './locales';

const letterPattern = /\p{L}/u;
const combiningMarkPattern = /\p{M}/u;
const numberPattern = /\p{N}/u;
const punctuationPattern = /\p{P}/u;
const symbolPattern = /\p{S}/u;
const separatorPattern = /\p{Z}/u;
const formatPattern = /\p{Cf}/u;
const controlCharacterPattern = /\p{Cc}/u;
const defaultIgnorableCodePointPattern = /\p{Default_Ignorable_Code_Point}/u;
const whiteSpacePattern = /\p{White_Space}/u;
const variationSelectorPattern = /\p{Variation_Selector}/u;
const emojiPresentationPattern = /\p{Emoji_Presentation}/u;
const bidiControlPattern = /\p{Bidi_Control}/u;

const REGIONAL_INDICATOR_START = 0x1f1e6;
const REGIONAL_INDICATOR_END = 0x1f1ff;
const HIGH_SURROGATE_START = 0xd800;
const HIGH_SURROGATE_END = 0xdbff;
const LOW_SURROGATE_START = 0xdc00;
const LOW_SURROGATE_END = 0xdfff;

// SPECIFIC_CODEPOINTS への追加時、abbr に該当する key を ja・en 両方の note に揃えないと型エラーになるよう交差で縛る
type NoteKey = keyof typeof unicodePlaygroundLocales.ja.note & keyof typeof unicodePlaygroundLocales.en.note;

export const SPECIFIC_CODEPOINTS = {
  [0x0009]: { abbr: 'HT' },
  [0x000a]: { abbr: 'LF' },
  [0x000d]: { abbr: 'CR' },
  [0x007f]: { abbr: 'DEL' },
  [0x0085]: { abbr: 'NEL' },
  [0x00a0]: { abbr: 'NBSP' },
  [0x00ad]: { abbr: 'SHY' },
  [0x034f]: { abbr: 'CGJ' },
  [0x061c]: { abbr: 'ALM' },
  [0x2007]: { abbr: 'FIGSP' },
  [0x2009]: { abbr: 'THSP' },
  [0x200a]: { abbr: 'HSP' },
  [0x200b]: { abbr: 'ZWSP' },
  [0x200c]: { abbr: 'ZWNJ' },
  [0x200d]: { abbr: 'ZWJ' },
  [0x200e]: { abbr: 'LRM' },
  [0x200f]: { abbr: 'RLM' },
  [0x2028]: { abbr: 'LSEP' },
  [0x2029]: { abbr: 'PSEP' },
  [0x202a]: { abbr: 'LRE' },
  [0x202b]: { abbr: 'RLE' },
  [0x202c]: { abbr: 'PDF' },
  [0x202d]: { abbr: 'LRO' },
  [0x202e]: { abbr: 'RLO' },
  [0x202f]: { abbr: 'NNBSP' },
  [0x205f]: { abbr: 'MMSP' },
  [0x2060]: { abbr: 'WJ' },
  [0x2066]: { abbr: 'LRI' },
  [0x2067]: { abbr: 'RLI' },
  [0x2068]: { abbr: 'FSI' },
  [0x2069]: { abbr: 'PDI' },
  [0x3000]: { abbr: 'IDSP' },
  [0xfe0e]: { abbr: 'VS15' },
  [0xfe0f]: { abbr: 'VS16' },
  [0xfeff]: { abbr: 'BOM' },
  [0xfffc]: { abbr: 'OBJ' },
  [0xfffd]: { abbr: 'REPL' },
} as const satisfies Record<number, { abbr: NoteKey }>;

type SpecificCodepointEntry = (typeof SPECIFIC_CODEPOINTS)[keyof typeof SPECIFIC_CODEPOINTS];

const lookupSpecific = (codePoint: number) =>
  (SPECIFIC_CODEPOINTS as Record<number, SpecificCodepointEntry | undefined>)[codePoint];

const CODEPOINT_RANGES: [number, number, string][] = [
  [0x2061, 0x2064, 'INVISIBLE OPERATOR'],
  [HIGH_SURROGATE_START, HIGH_SURROGATE_END, 'HIGH SURROGATE'],
  [LOW_SURROGATE_START, LOW_SURROGATE_END, 'LOW SURROGATE'],
  [REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END, 'REGIONAL INDICATOR'],
  [0x1f3fb, 0x1f3ff, 'SKIN TONE'],
  [0xe0001, 0xe0001, 'TAG'],
  [0xe0020, 0xe007f, 'TAG'],
  [0x115f, 0x1160, 'HANGUL FILLER'],
  [0x3164, 0x3164, 'HANGUL FILLER'],
  [0xffa0, 0xffa0, 'HALFWIDTH FILLER'],
  [0x0041, 0x005a, 'LATIN CAPITAL'],
  [0x0061, 0x007a, 'LATIN SMALL'],
  [0x3099, 0x309a, 'COMBINING MARK'],
  [0x3040, 0x309f, 'HIRAGANA'],
  [0x30a0, 0x30ff, 'KATAKANA'],
  [0x4e00, 0x9fff, 'CJK'],
];

const getPatternCategoryName = (codePoint: number) => {
  const char = String.fromCodePoint(codePoint);
  if (variationSelectorPattern.test(char)) {
    return 'VARIATION SELECTOR';
  }
  if (emojiPresentationPattern.test(char)) {
    return 'EMOJI';
  }
  if (letterPattern.test(char)) {
    return 'LETTER';
  }
  if (combiningMarkPattern.test(char)) {
    return 'MARK';
  }
  if (numberPattern.test(char)) {
    return 'NUMBER';
  }
  if (punctuationPattern.test(char)) {
    return 'PUNCTUATION';
  }
  if (symbolPattern.test(char)) {
    return 'SYMBOL';
  }
  if (separatorPattern.test(char)) {
    return 'SEPARATOR';
  }
  if (formatPattern.test(char)) {
    return 'FORMAT';
  }
  if (controlCharacterPattern.test(char)) {
    return 'CONTROL';
  }
  return '';
};

export const getCodepointName = (codePoint: number) => {
  const entry = lookupSpecific(codePoint);

  if (entry) {
    return entry.abbr;
  }

  const nameFromRanges = CODEPOINT_RANGES.find(([min, max]) => min <= codePoint && codePoint <= max)?.[2];
  if (nameFromRanges) {
    return nameFromRanges;
  }

  return getPatternCategoryName(codePoint);
};

export type CodepointCategory =
  | 'astral'
  | 'bidi-control'
  | 'combining-mark'
  | 'control'
  | 'default-ignorable'
  | 'lone-surrogate'
  | 'other'
  | 'regional-indicator'
  | 'variation-selector'
  | 'white-space';

const NO_GLYPH_CATEGORIES = new Set<CodepointCategory>([
  'variation-selector',
  'bidi-control',
  'default-ignorable',
  'control',
  'white-space',
  'lone-surrogate',
]);

const isLoneSurrogate = (codePoint: number) => HIGH_SURROGATE_START <= codePoint && codePoint <= LOW_SURROGATE_END;

const isRegionalIndicator = (codePoint: number) =>
  REGIONAL_INDICATOR_START <= codePoint && codePoint <= REGIONAL_INDICATOR_END;

export const getCodepointCategory = (codePoint: number): CodepointCategory => {
  // UTF-16 サロゲートペアの片割れ。単独では不正な Unicode
  if (isLoneSurrogate(codePoint)) {
    return 'lone-surrogate';
  }
  // 2文字で国・地域コードを表す記号（U+1F1E6-U+1F1FF）
  if (isRegionalIndicator(codePoint)) {
    return 'regional-indicator';
  }

  const char = String.fromCodePoint(codePoint);

  // 直前の文字の字形バリアントを指定する
  if (variationSelectorPattern.test(char)) {
    return 'variation-selector';
  }
  // 表示順や文字方向を制御する不可視文字（ALM, LRM, RLM, LRE, RLE など）
  if (bidiControlPattern.test(char)) {
    return 'bidi-control';
  }
  // LF・CR・TAB などの制御文字
  if (controlCharacterPattern.test(char)) {
    return 'control';
  }
  // 直前の基底文字と合成して1グリフを構成する結合文字
  if (combiningMarkPattern.test(char)) {
    return 'combining-mark';
  }
  // 空白・タブ・改行など
  if (whiteSpacePattern.test(char)) {
    return 'white-space';
  }
  // ほとんどの環境で不可視なコードポイント
  if (defaultIgnorableCodePointPattern.test(char)) {
    return 'default-ignorable';
  }
  // U+10000以上。UTF-16ではサロゲートペアになる
  if (0xffff < codePoint) {
    return 'astral';
  }
  return 'other';
};

const formatCategoryName = (category: CodepointCategory) => category.toUpperCase().replaceAll('-', ' ');

const getCategoryLabel = (codePoint: number, category: CodepointCategory) => {
  // 'other' はそのままだと意味が薄いので、可能なら一般カテゴリ名（SYMBOL など）に置き換える
  if (category === 'other') {
    return getPatternCategoryName(codePoint) || 'OTHER';
  }
  return formatCategoryName(category);
};

const getCodepointNote = (
  codePoint: number,
  entry: SpecificCodepointEntry | undefined,
  category: CodepointCategory,
  lang: Lang,
) => {
  if (entry) {
    return unicodePlaygroundLocales[lang].note[entry.abbr];
  }

  if (category === 'astral') {
    const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xd800;
    const low = ((codePoint - 0x10000) % 0x400) + 0xdc00;
    return (
      <>
        {unicodePlaygroundLocales[lang].categoryNote.astral}
        {`${toHex(high)} + ${toHex(low)}`}
      </>
    );
  }

  return unicodePlaygroundLocales[lang].categoryNote[category];
};

const ORANGE_CLASSES = 'border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/20';

const getCodepointClassName = (codePoint: number, name: string, category: CodepointCategory) => {
  switch (category) {
    case 'bidi-control':
    case 'default-ignorable':
    case 'variation-selector':
      return ORANGE_CLASSES;

    case 'astral':
      return 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20';

    case 'control':
      return 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20';

    case 'lone-surrogate':
      return 'border-pink-300 bg-pink-50 dark:border-pink-700 dark:bg-pink-900/20';

    default: {
      // 'other' のときは SPECIFIC 由来の abbr（REPL など）よりも一般カテゴリ（SYMBOL など）を優先して色を当てる
      const dispatchName = category === 'other' ? getPatternCategoryName(codePoint) || name : name;
      switch (dispatchName) {
        case 'FORMAT':
          return ORANGE_CLASSES;

        case 'PUNCTUATION':
          return 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20';

        case 'SEPARATOR':
          return 'border-cyan-300 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/20';

        case 'SYMBOL':
          return 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20';

        default:
          return 'border-secondary bg-secondary';
      }
    }
  }
};

// NoteBoxタイトルの主語ラベル。本文の主題と揃える:
// - SPECIFIC 個別 note: 略称（REPL, ZWJ など）
// - categoryNote.other（本文がBMPの話）: 'BMP'
// - その他カテゴリ note: そのカテゴリ名（ASTRAL, BIDI CONTROL など）
const getNoteSubject = (category: CodepointCategory, name: string, hasSpecificNote: boolean) => {
  if (hasSpecificNote) {
    return name;
  }
  if (category === 'other') {
    return 'BMP';
  }
  return formatCategoryName(category);
};

export const getCodepointMeta = (codePoint: number, lang: Lang = 'ja') => {
  const entry = lookupSpecific(codePoint);
  const category = getCodepointCategory(codePoint);
  const name = getCodepointName(codePoint);
  const hasSpecificNote = entry !== undefined;
  const noGlyph = hasSpecificNote || NO_GLYPH_CATEGORIES.has(category);

  return {
    name,
    category,
    noGlyph,
    categoryLabel: getCategoryLabel(codePoint, category),
    noteSubject: getNoteSubject(category, name, hasSpecificNote),
    note: getCodepointNote(codePoint, entry, category, lang),
    className: getCodepointClassName(codePoint, name, category),
  };
};
