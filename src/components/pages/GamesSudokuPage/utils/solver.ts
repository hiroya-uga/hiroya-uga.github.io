import { arrayShuffle } from '@/utils/array-shuffle';

import type { Board } from './types';

/** AIパワー */
export const generate = () => {
  const isDuplicated = ({ sudoku, row, col, num }: { sudoku: Board; row: number; col: number; num: number }) => {
    for (let i = 0; i < 9; i++) {
      if (sudoku[row][i] === num || sudoku[i][col] === num) {
        return true;
      }
    }

    const groupStartY = Math.floor(row / 3) * 3;
    const groupStartX = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (sudoku[groupStartY + i][groupStartX + j] === num) {
          return true;
        }
      }
    }

    return false;
  };
  const loop = (sudoku: Board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (Number.isNaN(sudoku[row][col]) === false) {
          continue;
        }

        const numbers = arrayShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of numbers) {
          if (isDuplicated({ sudoku, row, col, num })) {
            continue;
          }

          sudoku[row][col] = num;

          if (loop(sudoku) === false) {
            sudoku[row][col] = Number.NaN;
            continue;
          }
          return true;
        }

        return false; // どの数字も入らなければ戻る
      }
    }
    return true; // すべて埋まった
  };

  const sudoku = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Number.NaN));
  loop(sudoku);
  return sudoku;
};
