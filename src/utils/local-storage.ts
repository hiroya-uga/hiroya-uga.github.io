type Key = keyof Value;
type Value = {
  'savedata-sudoku-game': {
    shouldShowCorrectRatio?: boolean;
    shouldShowHints?: boolean;
    shouldHighLight?: boolean;
    level?: number;
  };
  'cookie-consent': 'accepted' | 'rejected';
};

export const setLocalStorage = <T extends Key>(key: T, value: Value[T]) => {
  try {
    const savedata = typeof value === 'object' ? value : { type: 'primitive', value };
    localStorage.setItem(key, JSON.stringify(savedata));
  } catch (error) {
    console.error(`Error setting local storage for key "${key}":`, error);
  }
};

export const getLocalStorage = <T extends Key>(key: T): Value[T] | null => {
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
};
