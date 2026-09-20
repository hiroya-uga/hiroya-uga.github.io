import { arrayShuffle } from '@/utils/array-shuffle';

import type { Board, SolveResult } from './types';

const ALL_CANDIDATES = 0b111111111;

/** 解なしの証明は探索を尽くす必要があるため、打ち切り用の上限を設ける */
const SEARCH_STEP_LIMIT = 500000;

const getBlockIndex = (row: number, col: number) => Math.floor(row / 3) * 3 + Math.floor(col / 3);

const countBits = (bits: number) => {
  let count = 0;

  for (let rest = bits; rest !== 0; rest >>= 1) {
    count += rest & 1;
  }

  return count;
};

/** 候補のビットマスクを数字の配列へ展開する */
const toNumbers = (candidates: number) => {
  const numbers: number[] = [];

  for (let n = 0; n < 9; n++) {
    if ((candidates & (1 << n)) !== 0) {
      numbers.push(n + 1);
    }
  }

  return numbers;
};

export const createEmptyBoard = (): Board =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => Number.NaN));

interface SolveOptions {
  /** 候補を試す順序をランダムにする。問題の生成に使う */
  shuffle?: boolean;
  /** 探索の打ち切り上限 */
  stepLimit?: number;
}

/**
 * 埋まっているマスをそのまま残して盤面を完成させる。
 * 完成できない場合は 'unsolvable' を返すため、
 * 「重複はしていないが、その配置では最後まで埋まらない」手の検出にも使える。
 * 探索が stepLimit を超えた場合は判定せず 'unknown' を返す。
 */
export const solve = (
  board: Board,
  { shuffle = false, stepLimit = SEARCH_STEP_LIMIT }: SolveOptions = {},
): SolveResult => {
  const grid = board.map((row) => [...row]);
  const rows = Array.from({ length: 9 }, () => 0);
  const cols = Array.from({ length: 9 }, () => 0);
  const blocks = Array.from({ length: 9 }, () => 0);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = grid[r][c];

      if (Number.isNaN(value)) {
        continue;
      }

      const bit = 1 << (value - 1);
      const blockIndex = getBlockIndex(r, c);

      if ((rows[r] & bit) !== 0 || (cols[c] & bit) !== 0 || (blocks[blockIndex] & bit) !== 0) {
        return { status: 'unsolvable' };
      }

      rows[r] |= bit;
      cols[c] |= bit;
      blocks[blockIndex] |= bit;
    }
  }

  let steps = 0;
  let aborted = false;

  const search = (): boolean => {
    if (stepLimit < ++steps) {
      aborted = true;
      return false;
    }

    // 候補が少ないマスから埋めると、矛盾が早い段階で露見して枝刈りが効く
    let targetRow = -1;
    let targetCol = -1;
    let targetCandidates = 0;
    let fewest = 10;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (Number.isNaN(grid[r][c]) === false) {
          continue;
        }

        const candidates = ~(rows[r] | cols[c] | blocks[getBlockIndex(r, c)]) & ALL_CANDIDATES;
        const count = countBits(candidates);

        if (count === 0) {
          return false;
        }

        if (count < fewest) {
          fewest = count;
          targetRow = r;
          targetCol = c;
          targetCandidates = candidates;
        }
      }
    }

    if (targetRow === -1) {
      return true; // 空きマスなし＝完成
    }

    const blockIndex = getBlockIndex(targetRow, targetCol);
    const numbers = toNumbers(targetCandidates);

    for (const num of shuffle ? arrayShuffle(numbers) : numbers) {
      const bit = 1 << (num - 1);

      grid[targetRow][targetCol] = num;
      rows[targetRow] |= bit;
      cols[targetCol] |= bit;
      blocks[blockIndex] |= bit;

      if (search()) {
        return true;
      }

      grid[targetRow][targetCol] = Number.NaN;
      rows[targetRow] &= ~bit;
      cols[targetCol] &= ~bit;
      blocks[blockIndex] &= ~bit;

      if (aborted) {
        return false;
      }
    }

    return false;
  };

  if (search()) {
    return { status: 'solved', board: grid };
  }

  return { status: aborted ? 'unknown' : 'unsolvable' };
};

/** 完成した解答を1つ作る */
export const generate = (): Board => {
  const result = solve(createEmptyBoard(), { shuffle: true });

  // 空の盤面は必ず完成できるため、探索を打ち切らないかぎりここへは来ない
  if (result.status !== 'solved') {
    throw new Error('数独の問題を生成できませんでした。');
  }

  return result.board;
};
