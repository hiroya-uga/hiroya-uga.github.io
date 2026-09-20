import { describe, expect, it } from 'vitest';

import { generate, solve } from '@/components/pages/GamesSudokuPage/utils';

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** ルール上正しい完成盤面 */
const SOLVED_BOARD = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 1, 4, 3, 6, 5, 8, 9, 7],
  [3, 6, 5, 8, 9, 7, 2, 1, 4],
  [8, 9, 7, 2, 1, 4, 3, 6, 5],
  [5, 3, 1, 6, 4, 2, 9, 7, 8],
  [6, 4, 2, 9, 7, 8, 5, 3, 1],
  [9, 7, 8, 5, 3, 1, 6, 4, 2],
];

const createEmptyBoard = () => Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Number.NaN));

const sortAscending = (values: number[]) => [...values].sort((a, b) => a - b);

const getRow = (board: number[][], index: number) => board[index];
const getColumn = (board: number[][], index: number) => board.map((row) => row[index]);
const getBlock = (board: number[][], index: number) => {
  const top = Math.floor(index / 3) * 3;
  const left = (index % 3) * 3;

  return [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => board[top + i][left + j]));
};

/** 埋まっているマスの中に同じ数字があるか */
const hasDuplicate = (board: number[][]) =>
  NUMBERS.some((_, i) =>
    [getRow(board, i), getColumn(board, i), getBlock(board, i)].some((values) => {
      const filled = values.filter((value) => Number.isNaN(value) === false);

      return new Set(filled).size !== filled.length;
    }),
  );

/** 数独のルールを満たして完全に埋まっているか */
const isCompleted = (board: number[][]) =>
  NUMBERS.every(
    (_, i) =>
      sortAscending(getRow(board, i)).join() === NUMBERS.join() &&
      sortAscending(getColumn(board, i)).join() === NUMBERS.join() &&
      sortAscending(getBlock(board, i)).join() === NUMBERS.join(),
  );

describe('generate', () => {
  it('9×9の盤面を返す', () => {
    const board = generate();

    expect(board).toHaveLength(9);
    expect(board.every((row) => row.length === 9)).toBe(true);
  });

  it('すべてのマスが1〜9で埋まる', () => {
    const board = generate();

    expect(board.flat().filter((value) => Number.isInteger(value) && 1 <= value && value <= 9)).toHaveLength(81);
  });

  it('すべての行・列・3×3ブロックに1〜9が1つずつ並ぶ', () => {
    for (let count = 0; count < 10; count++) {
      expect(isCompleted(generate())).toBe(true);
    }
  });

  it('呼び出すたびに異なる盤面を返す', () => {
    const boards = Array.from({ length: 10 }, () => JSON.stringify(generate()));

    expect(new Set(boards).size).toBeGreaterThan(1);
  });
});

describe('solve', () => {
  /** 1行目・4行目・7行目だけを空にした盤面。SOLVED_BOARD へ戻せるので必ず解がある */
  const createPartialBoard = () => SOLVED_BOARD.map((row, r) => (r % 3 === 0 ? row.map(() => Number.NaN) : [...row]));

  it('完成済みの正しい盤面はそのまま返す', () => {
    expect(solve(SOLVED_BOARD)).toStrictEqual({ status: 'solved', board: SOLVED_BOARD });
  });

  it('生成直後の盤面は解ありと判定する', () => {
    expect(solve(generate()).status).toBe('solved');
  });

  it('空の盤面から完成した盤面を作る', () => {
    const result = solve(createEmptyBoard());

    expect(result.status).toBe('solved');
    expect(result.status === 'solved' && isCompleted(result.board)).toBe(true);
  });

  it('埋まっているマスの値を変えずに残りを埋める', () => {
    const board = createPartialBoard();
    const result = solve(board);

    expect(result.status).toBe('solved');

    if (result.status !== 'solved') return;

    expect(isCompleted(result.board)).toBe(true);
    expect(board.every((row, r) => row.every((value, c) => Number.isNaN(value) || value === result.board[r][c]))).toBe(
      true,
    );
  });

  it('入力から導ける解が生成時の解答と異なっていても、その入力を残したまま完成させる', () => {
    // 同じブロック行の中で行を入れ替えても数独は成立するため、1行目に2行目の並びを入力した状態を作る
    const board = SOLVED_BOARD.map((row, r) => (r < 3 ? row.map(() => Number.NaN) : [...row]));
    board[0] = [...SOLVED_BOARD[1]];

    expect(board[0]).not.toStrictEqual(SOLVED_BOARD[0]);

    const result = solve(board);

    expect(result.status).toBe('solved');

    if (result.status !== 'solved') return;

    expect(isCompleted(result.board)).toBe(true);
    expect(result.board[0]).toStrictEqual(SOLVED_BOARD[1]);
    expect(result.board).not.toStrictEqual(SOLVED_BOARD);
  });

  it('同じ数字が重複している盤面は解なしと判定する', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[0][4] = 5;

    expect(solve(board)).toStrictEqual({ status: 'unsolvable' });
  });

  it('重複していなくても完成できない盤面は解なしと判定する', () => {
    const board = createPartialBoard();

    // 列2の空きマスの候補は1・3・4。ここへ1を置くと左下ブロックの候補が尽きて詰む
    board[3][2] = 1;

    expect(hasDuplicate(board)).toBe(false);
    expect(solve(board)).toStrictEqual({ status: 'unsolvable' });

    // 同じ位置でも正解の値なら解ありのまま
    board[3][2] = SOLVED_BOARD[3][2];

    expect(solve(board).status).toBe('solved');
  });

  it('探索の上限を超えたら判定せずunknownを返す', () => {
    expect(solve(createEmptyBoard(), { stepLimit: 1 })).toStrictEqual({ status: 'unknown' });
  });

  it('渡された盤面を破壊しない', () => {
    const board = createPartialBoard();
    const snapshot = JSON.stringify(board);

    solve(board);

    expect(JSON.stringify(board)).toBe(snapshot);
  });
});
