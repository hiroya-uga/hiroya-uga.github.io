import { generate, solve } from './solver';

import type { SolveResult, SudokuCell, SudokuState } from './types';

/** 同じ行・列・3×3ブロックに同じ数字があるマスへ印を付ける。渡された盤面は変更しない */
export const checkDuplicate = (sudoku: SudokuState): SudokuState => {
  const next = sudoku.map((row) => row.map((cell) => ({ ...cell, duplicated: false })));

  const markDuplicated = (cells: { r: number; c: number }[]) => {
    const bucket = new Map<number, { r: number; c: number }[]>();

    for (const { r, c } of cells) {
      const { value } = next[r][c];

      // MapはNaNを同一キーとして扱うため、未入力セル同士が重複と判定されてしまう
      if (Number.isNaN(value)) {
        continue;
      }

      bucket.set(value, [...(bucket.get(value) ?? []), { r, c }]);
    }

    for (const coords of bucket.values()) {
      if (1 < coords.length) {
        for (const { r, c } of coords) {
          next[r][c].duplicated = true;
        }
      }
    }
  };

  for (let i = 0; i < 9; i++) {
    const top = Math.floor(i / 3) * 3;
    const left = (i % 3) * 3;

    markDuplicated(Array.from({ length: 9 }, (_, c) => ({ r: i, c })));
    markDuplicated(Array.from({ length: 9 }, (_, r) => ({ r, c: i })));
    markDuplicated([0, 1, 2].flatMap((y) => [0, 1, 2].map((x) => ({ r: top + y, c: left + x }))));
  }

  return next;
};

/**
 * 入力マスのうち、ユーザーが数独のルールを満たして埋めたマスの割合（％）を返す。
 * 生成時の解答とは照合しないため、ルール上正しい別解もそのまま正解として扱う。
 */
export const getCorrectRatio = (sudoku: SudokuState): number => {
  const input = sudoku.flat().filter((cell) => cell.type === 'input');

  // 入力マスが1つもない盤面は0除算になるため、完成済みとみなす
  if (input.length === 0) {
    return 100;
  }

  const correctLength = input.filter(
    // ギブアップで埋まったマスは自力で埋めたことにならないため、進捗に数えない
    (cell) => cell.state !== 'answer' && Number.isNaN(cell.value) === false && cell.duplicated === false,
  ).length;

  return Math.floor((correctLength / input.length) * 10000) / 100;
};

/** 問題の生成が終わるまで表示する空の盤面 */
export const createLoadingState = (): SudokuState =>
  Array.from({ length: 9 }, () =>
    Array.from(
      { length: 9 },
      (): SudokuCell => ({
        value: Number.NaN,
        type: 'loading',
        state: 'idle',
        duplicated: false,
        answer: Number.NaN,
      }),
    ),
  );

/** level は入力マス（空欄）の割合（％） */
export const createSudokuState = (level: number): SudokuState => {
  const answer = generate();
  // level が低いと1マスも空かないことがあるため、必ず空けるマスを先に決めておく
  const blankIndex = Math.floor(Math.random() * 81);

  return answer.map((row, r) =>
    row.map((num, c): SudokuCell => {
      const type = r * 9 + c === blankIndex || Math.random() < level / 100 ? 'input' : 'hint';

      return {
        value: type === 'input' ? Number.NaN : num,
        type,
        state: 'idle',
        duplicated: false,
        answer: num,
      };
    }),
  );
};

/** 入力マスだけを未入力へ戻す */
export const resetInputs = (sudoku: SudokuState): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) => ({
      ...cell,
      value: cell.type === 'input' ? Number.NaN : cell.value,
      duplicated: false,
      state: 'idle' as const,
    })),
  );

/**
 * 重複しているマスを空にして invalid にする。未入力は「間違い」ではないため対象にしない。
 * keepsBaseAnswer を指定すると、生成時の解答と一致するマスだけは残す。
 * 生成時の解答は行・列・ブロック内で値が重ならないため、残したマスが重複したまま残ることはない。
 */
export const clearDuplicatedInputs = (sudoku: SudokuState, { keepsBaseAnswer = false } = {}): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) =>
      cell.type === 'input' && cell.duplicated && (keepsBaseAnswer === false || cell.value !== cell.answer)
        ? { ...cell, value: Number.NaN, duplicated: false, state: 'invalid' as const }
        : // 重複の相手だった入力を消した以上、巻き込まれたヒント側の印も落ちる
          { ...cell, duplicated: false, state: 'idle' as const },
    ),
  );

const getStatus = (sudoku: SudokuState): SolveResult['status'] =>
  solve(sudoku.map((row) => row.map((cell) => cell.value))).status;

/** 埋まっている入力マスへ正解の印を付ける。未入力とヒントは対象にしない */
export const markCorrectInputs = (sudoku: SudokuState): SudokuState =>
  sudoku.map((row) =>
    row.map((cell) =>
      cell.type === 'input' && Number.isNaN(cell.value) === false ? { ...cell, state: 'correct' as const } : cell,
    ),
  );

/**
 * 重複した入力を消したうえで、残りの盤面を完成させられるか調べる。
 * 生成時の解答と一致する入力は、消すことで完成できるようになる場合にかぎって消す。
 * 完成できる見込みがある場合だけ、残った入力へ正解の印を付ける。
 */
export const reviewInputs = (sudoku: SudokuState): { sudoku: SudokuState; status: SolveResult['status'] } => {
  const marked = checkDuplicate(sudoku);
  const kept = clearDuplicatedInputs(marked, { keepsBaseAnswer: true });
  // 重複を消したあとの盤面で判定しないと、重複そのものを行き詰まりとして数えてしまう
  const keptStatus = getStatus(kept);

  if (keptStatus !== 'unsolvable') {
    return { sudoku: markCorrectInputs(kept), status: keptStatus };
  }

  const cleared = clearDuplicatedInputs(marked);
  const clearedStatus = getStatus(cleared);

  // 消しても行き詰まるなら原因は重複ではない。正しく埋まっていたマスまで失わせない
  if (clearedStatus === 'unsolvable') {
    return { sudoku: kept, status: keptStatus };
  }

  return { sudoku: markCorrectInputs(cleared), status: clearedStatus };
};

/**
 * 入力マスを解答で埋める。
 * 別解も正解として扱うため、ユーザーの入力から解を導ける場合はその入力を残したまま完成させる。
 */
export const fillAnswer = (sudoku: SudokuState): { sudoku: SudokuState; keepsOwnInput: boolean } => {
  const result = solve(sudoku.map((row) => row.map((cell) => cell.value)));
  const filled = result.status === 'solved' ? result.board : null;

  return {
    keepsOwnInput: filled !== null,
    sudoku: sudoku.map((row, r) =>
      row.map((cell, c) => {
        if (cell.type !== 'input') {
          // 完成した盤面に重複は残らないため、ヒント側の印も落とす
          return { ...cell, duplicated: false };
        }

        const value = filled?.[r][c] ?? cell.answer;

        return {
          ...cell,
          value,
          duplicated: false,
          // 未入力のマスは NaN のため、自力で埋めていたマスだけが correct になる
          state: value === cell.value ? ('correct' as const) : ('answer' as const),
        };
      }),
    ),
  };
};
