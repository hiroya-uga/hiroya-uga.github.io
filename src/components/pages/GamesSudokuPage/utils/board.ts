import { generate } from './solver';

import type { SudokuState } from './types';

/** AIパワー */
export const checkDuplicate = (sudoku: SudokuState) => {
  // 1. 盤面をディープコピー（元を壊さない）
  const next = sudoku.map((row) =>
    row.map((cell) => ({
      ...cell,
      duplicated: false,
    })),
  );

  /* ---------- 行のチェック ---------- */
  for (let r = 0; r < 9; r++) {
    const bucket = new Map<number, { r: number; c: number }[]>();
    for (let c = 0; c < 9; c++) {
      const { value } = next[r][c];
      if (value === 0) continue;
      (bucket.get(value) ?? bucket.set(value, []).get(value)!).push({ r, c });
    }
    for (const coords of bucket.values()) {
      if (coords.length > 1) coords.forEach(({ r, c }) => (next[r][c].duplicated = true));
    }
  }

  /* ---------- 列のチェック ---------- */
  for (let c = 0; c < 9; c++) {
    const bucket = new Map<number, { r: number; c: number }[]>();
    for (let r = 0; r < 9; r++) {
      const { value } = next[r][c];
      if (value === 0) continue;
      (bucket.get(value) ?? bucket.set(value, []).get(value)!).push({ r, c });
    }
    for (const coords of bucket.values()) {
      if (coords.length > 1) coords.forEach(({ r, c }) => (next[r][c].duplicated = true));
    }
  }

  /* ---------- ブロックのチェック ---------- */
  for (let block = 0; block < 9; block++) {
    const br = Math.floor(block / 3); // 0,1,2
    const bc = block % 3; // 0,1,2
    const bucket = new Map<number, { r: number; c: number }[]>();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = br * 3 + i;
        const c = bc * 3 + j;
        const { value } = next[r][c];
        if (value === 0) continue;
        (bucket.get(value) ?? bucket.set(value, []).get(value)!).push({ r, c });
      }
    }
    for (const coords of bucket.values()) {
      if (coords.length > 1) coords.forEach(({ r, c }) => (next[r][c].duplicated = true));
    }
  }

  return next;
};

/** 入力マスのうち、埋まっていて重複もしていないマスの割合（％） */
export const getCorrectRatio = (sudoku: SudokuState) => {
  const input = sudoku.flat().filter((cell) => cell.type === 'input');
  const correctLength = input.filter((cell) => Number.isNaN(cell.value) === false && cell.duplicated === false).length;

  return Math.floor((correctLength / input.length) * 10000) / 100;
};

/** 盤面の生成が終わるまで表示しておく空の盤面 */
export const createLoadingState = (): SudokuState =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: Number.NaN,
      type: 'loading' as const,
      state: 'idle' as const,
      duplicated: false,
      answer: Number.NaN,
    })),
  );

/** level は入力マス（空欄）の割合（％） */
export const createSudokuState = (level: number): SudokuState => {
  const sudoku = generate();
  const levelValue = 1 - Math.abs((100 - level) / 100);

  return sudoku.map((row) =>
    row.map((num) => {
      const type = Math.random() < levelValue ? ('input' as const) : ('hint' as const);
      const value = type === 'input' ? Number.NaN : num;

      return { value, type, answer: num, state: 'idle' as const, duplicated: false };
    }),
  );
};

/** 入力マスをすべて空へ戻す */
export const resetInputs = (sudoku: SudokuState): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) => {
      if (cell.type === 'input') {
        return { ...cell, value: Number.NaN, state: 'idle' as const };
      }
      return cell;
    }),
  );

/** 重複している入力マスを空にして、間違いとして印を付ける */
export const clearDuplicatedInputs = (sudoku: SudokuState): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) => {
      if (cell.type === 'input' && (Number.isNaN(cell.value) || cell.duplicated)) {
        return { ...cell, value: Number.NaN, state: 'invalid' as const };
      }
      return { ...cell, state: 'idle' as const };
    }),
  );

/** 入力マスを答えで埋める */
export const fillAnswer = (sudoku: SudokuState): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) => {
      if (cell.type === 'input') {
        return { ...cell, value: cell.answer, state: 'answer' as const };
      }
      return cell;
    }),
  );
