import { UNSUPPORTED_LABEL } from './constants';

export const formatNumber = (value: number | undefined | null, fractionDigits = 4): string => {
  if (value === null || value === undefined || Number.isFinite(value) === false) {
    return UNSUPPORTED_LABEL;
  }
  return Number(value.toFixed(fractionDigits)).toString();
};

/**
 * 倍率表示用に末尾の 0 を保持する固定小数点フォーマッタ（例: x1.00, x1.50）。
 */
export const formatFixed = (value: number | undefined | null, fractionDigits = 2): string => {
  if (value === null || value === undefined || Number.isFinite(value) === false) {
    return UNSUPPORTED_LABEL;
  }
  return value.toFixed(fractionDigits);
};

/**
 * '4g' / 'slow-2g' などのトークン値を 4G / SLOW-2G に整える。
 */
export const formatNetworkType = (value: string | null | undefined): string => {
  if (value === null || value === undefined || value.length === 0) {
    return UNSUPPORTED_LABEL;
  }
  return value.toUpperCase();
};

export const formatBytes = (bytes: number | undefined | null): string => {
  if (bytes === null || bytes === undefined || Number.isFinite(bytes) === false) {
    return UNSUPPORTED_LABEL;
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 ** 2) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  if (bytes < 1024 ** 3) {
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  }
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};

export const formatTimezoneOffset = (min: number, tzName?: string): string => {
  const offsetMinutes = -min;
  const sign = 0 <= offsetMinutes ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  const base = `UTC${sign}${h}:${m}`;
  if (tzName !== undefined && 0 < tzName.length) {
    return `${base} (${tzName})`;
  }
  return base;
};
