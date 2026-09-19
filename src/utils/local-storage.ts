type Value = {
  // ユーザ設定
  theme: 'dark' | 'light';
  platform: string;
  'cookie-consent': 'accepted' | 'rejected';

  // ページごとのキー
  home: {
    'power-section-viewed-at'?: string;
    'recent-tools-section-is-enabled'?: boolean;
  };

  // tools
  'savedata-focal-length-checker': {
    deviceFocalLength?: number;
    selectedFormatId?: string;
    selectedRefAspectRatioId?: string;
    focalLengthsInput?: string;
    focalLengthByCamera?: Record<string, number>;
  };
  'savedata-sudoku-game': {
    shouldShowCorrectRatio?: boolean;
    shouldShowHints?: boolean;
    shouldHighLight?: boolean;
    level?: number;
  };

  // その他
  'recent-tools': {
    pathname: string;
    count: number;
    lastAccessedAt: string;
  }[];
  shown: {
    'recent-tools-section-prompt'?: boolean;
  };
  achievement: Partial<Record<string, boolean>>;
};
type Key = keyof Value;

export type LocalStorageItems = Value;

export const setLocalStorage = <T extends Key>(key: T, value: Value[T]) => {
  try {
    const savedata = typeof value === 'object' ? value : { type: 'primitive', value };
    localStorage.setItem(key, JSON.stringify(savedata));
  } catch (error) {
    console.error(`Error setting local storage for key "${key}":`, error);
  }
};

interface GetLocalStorageOptions {
  withRaw: true;
}

interface GetLocalStorageWithRawResult<T extends Key> {
  raw: string | null;
  parsed: Value[T] | null;
}

export function getLocalStorage<T extends Key>(
  key: T,
  options: {
    withRaw: true;
  },
): GetLocalStorageWithRawResult<T>;
export function getLocalStorage<T extends Key>(key: T): Value[T] | null;
export function getLocalStorage<T extends Key>(
  key: T,
  options?: GetLocalStorageOptions,
): GetLocalStorageWithRawResult<T> | Value[T] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const result = (() => {
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? '{"type": "primitive"}');

      if (value.type === 'primitive') {
        return value.value ?? (null as Value[T] | null);
      }

      return value as Value[T] | null;
    } catch (error) {
      console.error(`Error setting local storage for key "${key}":`, error);
    }

    return null;
  })();

  if (options?.withRaw) {
    return {
      raw: localStorage.getItem(key),
      parsed: result,
    };
  }

  return result;
}
