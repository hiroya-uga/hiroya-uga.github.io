import { describe, expect, it } from 'vitest';

import { arrayShuffle } from '@/utils/array-shuffle';

describe('arrayShuffle', () => {
  it('要素数を変えない', () => {
    const input = [1, 2, 3, 4, 5];

    expect(arrayShuffle(input)).toHaveLength(input.length);
  });

  it('元の配列を破壊しない', () => {
    const input = [1, 2, 3, 4, 5];
    arrayShuffle(input);

    expect(input).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('元の配列と同じ要素を持つ（順序は問わない）', () => {
    const input = [1, 2, 3, 4, 5];
    const result = arrayShuffle(input);

    expect([...result].sort()).toStrictEqual([...input].sort());
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(arrayShuffle([])).toStrictEqual([]);
  });

  it('要素数1の配列はそのまま返す', () => {
    expect(arrayShuffle([1])).toStrictEqual([1]);
  });
});
