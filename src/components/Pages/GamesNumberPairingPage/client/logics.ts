export type Button = {
  id: number;
  value: number;
  cleared: boolean;
  isSum: boolean;
};

export type GameStatus = 'playing' | 'game-over';
export type GameMode = '1' | '2';

const PAIRS: [number, number][] = [
  [2, 8],
  [3, 7],
  [4, 6],
  [5, 5],
  [6, 4],
  [7, 3],
  [8, 2],
];

import { arrayShuffle } from '@/utils/array-shuffle';

let nextId = 0;
const createButton = (value: number): Button => ({ id: nextId++, value, cleared: false, isSum: false });

// モード1: ランダムなペア (合計10) を count 個配置
export const generateButtons = (count: number): Button[] => {
  const pairCount = count / 2;
  const numbers: number[] = [];

  for (let i = 0; i < pairCount; i++) {
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    numbers.push(pair[0], pair[1]);
  }

  return arrayShuffle(numbers).map(createButton);
};

// モード2: length 個の正整数（各1〜8）で合計10になるチェーンを生成
// length >= 3 のとき、チェーン内の任意の2数の和は最大 10-(length-2) <= 8 < 10 → 直接ペアにならない
const generateChain = (length: number): number[] => {
  const result: number[] = [];
  let remaining = 10;
  for (let i = 0; i < length - 1; i++) {
    const spotsLeft = length - i;
    const max = Math.min(8, remaining - (spotsLeft - 1));
    if (max < 1) return generateChain(length); // 万一の再試行（実質不要）
    result.push(Math.floor(Math.random() * max) + 1);
    remaining -= result[result.length - 1];
  }
  result.push(remaining);
  return result;
};

// モード2: ちょうど buttonCount 個のボタンを生成
// buttonCount を長さ3のチェーンに分割（余りは長さ4か2で吸収）
// 各チェーンが合計10 → クリア保証
// 長さ >= 3 のチェーンは直接ペアなし → マージ必須
export const generateMode2Buttons = (buttonCount: number): Button[] => {
  const numbers: number[] = [];
  let remaining = buttonCount;

  if (remaining % 3 === 1) {
    numbers.push(...generateChain(4));
    remaining -= 4;
  }
  if (remaining % 3 === 2) {
    numbers.push(...generateChain(2));
    remaining -= 2;
  }
  while (remaining > 0) {
    numbers.push(...generateChain(3));
    remaining -= 3;
  }

  return arrayShuffle(numbers).map(createButton);
};

export const activeButtons = (buttons: Button[]) => buttons.filter((b) => !b.cleared);

const isSquarish = (n: number) => n % Math.ceil(Math.sqrt(n)) === 0;

export const nextButtonCount = (current: number) => {
  let next = current + 2;
  while (!isSquarish(next)) next += 2;
  return next;
};

// モード1: sum === 10 のペアが存在するか
export const hasValidPair = (buttons: Button[]): boolean => {
  const active = activeButtons(buttons);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      if (active[i].value + active[j].value === 10) return true;
    }
  }
  return false;
};

// モード2: 全ボタンが少なくとも1つのペア相手を持っているか
// 1つでも孤立（他の全ボタンとの合計が10超）なボタンがあればfalse
export const hasAvailableMove = (buttons: Button[]): boolean => {
  const active = activeButtons(buttons);
  return active.every((b) => active.some((other) => other.id !== b.id && b.value + other.value <= 10));
};
