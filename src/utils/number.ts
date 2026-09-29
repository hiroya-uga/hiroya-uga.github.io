import { formatStringToNumericString } from './formatter';

/** 全角数字を半角化し数字以外を除去したうえで整数化する。変換できない場合は NaN を返す */
export const parseInteger = (value: string): number => {
  const numericString = formatStringToNumericString(value);
  return numericString === '' ? Number.NaN : Number(numericString);
};

/** min 以上 max 以下の整数をランダムに返す */
export const getRandomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** value を min 以上 max 以下に丸める */
export const clamp = ({ value, min, max }: { value: number; min: number; max: number }) =>
  Math.min(max, Math.max(min, value));

/** 範囲外になりうる nextIndex を、0 以上 total 未満の範囲に折り返す */
export const resolveLoopIndex = ({ nextIndex, total }: { nextIndex: number; total: number }) =>
  ((nextIndex % total) + total) % total;
