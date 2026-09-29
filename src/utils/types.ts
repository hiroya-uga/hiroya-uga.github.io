export const nonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== undefined && value !== null;
};

export const hasItems = <T = unknown>(array: T[] | null | undefined): array is [T, ...T[]] => {
  if (nonNullable(array)) {
    return array.length !== 0;
  }

  return false;
};
