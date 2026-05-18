const unicodeCodePointEscapePattern = /\\u\{([0-9a-fA-F]{1,6})\}/g;
const unicodeEscapePattern = /\\u([0-9a-fA-F]{4})/g;

const isSegmenterSupported = typeof Intl.Segmenter === 'function';
const segmenterCache = new Map<string, { segment(text: string): Iterable<{ segment: string }> }>();

const getSegmenter = (locale: string) => {
  if (!segmenterCache.has(locale)) {
    segmenterCache.set(
      locale,
      isSegmenterSupported
        ? new Intl.Segmenter(locale, { granularity: 'grapheme' })
        : { segment: (text: string) => [...text].map((segment) => ({ segment })) },
    );
  }
  return segmenterCache.get(locale)!;
};
const textEncoder = new TextEncoder();

export const toHex = (codePoint: number): string => `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;

export const decodeUnicodeEscapes = (input: string): string =>
  input
    .replaceAll(unicodeCodePointEscapePattern, (match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    })
    .replaceAll(unicodeEscapePattern, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));

export const getStringMetrics = (text: string, locale = 'ja') => {
  const utf16Length = text.length;
  const utf8Bytes = textEncoder.encode(text).length;
  const codepointCount = [...text].length;
  const graphemeCount = [...getSegmenter(locale).segment(text)].length;

  return {
    utf16Length,
    utf8Bytes,
    codepointCount,
    graphemeCount,
  };
};
