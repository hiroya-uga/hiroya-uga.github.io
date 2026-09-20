import { describe, expect, it } from 'vitest';

import type { SudokuCell } from '@/components/pages/GamesSudokuPage/utils';
import {
  checkDuplicate,
  clearDuplicatedInputs,
  createLoadingState,
  createSudokuState,
  fillAnswer,
  getCorrectRatio,
  markCorrectInputs,
  resetInputs,
  reviewInputs,
  solve,
} from '@/components/pages/GamesSudokuPage/utils';

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

/** すべてのマスを入力マスにした盤面。解答は持たせない */
const createState = (board: number[][]): SudokuCell[][] =>
  board.map((row) =>
    row.map((value) => ({
      value,
      type: 'input',
      state: 'idle',
      duplicated: false,
      answer: Number.NaN,
    })),
  );

/** SOLVED_BOARD を解答とし、isInput が真を返すマスだけを入力マスにした盤面 */
const createGameState = (isInput: (rowIndex: number, colIndex: number) => boolean): SudokuCell[][] =>
  SOLVED_BOARD.map((row, r) =>
    row.map((answer, c) => {
      const type = isInput(r, c) ? 'input' : 'hint';

      return {
        value: type === 'input' ? Number.NaN : answer,
        type,
        state: 'idle',
        duplicated: false,
        answer,
      };
    }),
  );

/** 重複と判定されたマスの座標を行優先で返す */
const getDuplicatedCoords = (state: { duplicated: boolean }[][]) =>
  state.flatMap((row, r) => row.flatMap((cell, c) => (cell.duplicated ? [[r, c]] : [])));

describe('checkDuplicate', () => {
  it('未入力のマスが同じ行・列・ブロックに複数あっても重複と判定しない', () => {
    expect(getDuplicatedCoords(checkDuplicate(createState(createEmptyBoard())))).toStrictEqual([]);
  });

  it('1マスだけ入力された盤面では、残りの未入力マスを重複と判定しない', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    expect(getDuplicatedCoords(checkDuplicate(createState(board)))).toStrictEqual([]);
  });

  it('同じ行に同じ数字があると、その両方を重複と判定する', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[0][4] = 5;

    expect(getDuplicatedCoords(checkDuplicate(createState(board)))).toStrictEqual([
      [0, 0],
      [0, 4],
    ]);
  });

  it('同じ列に同じ数字があると、その両方を重複と判定する', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[4][0] = 5;

    expect(getDuplicatedCoords(checkDuplicate(createState(board)))).toStrictEqual([
      [0, 0],
      [4, 0],
    ]);
  });

  it('同じ3×3ブロックに同じ数字があると、その両方を重複と判定する', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[1][1] = 5;

    expect(getDuplicatedCoords(checkDuplicate(createState(board)))).toStrictEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it('重複が解消されたマスのフラグを落とす', () => {
    const state = createState(createEmptyBoard()).map((row) => row.map((cell) => ({ ...cell, duplicated: true })));

    expect(getDuplicatedCoords(checkDuplicate(state))).toStrictEqual([]);
  });

  it('渡された盤面を破壊しない', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[0][4] = 5;
    const state = createState(board);

    checkDuplicate(state);

    expect(getDuplicatedCoords(state)).toStrictEqual([]);
  });
});

describe('getCorrectRatio', () => {
  it('生成時の解答と異なる別解でも100を返す', () => {
    // 1と2を入れ替えた盤面もルール上は正しい解答になる
    const swap = (value: number) => {
      if (value === 1) return 2;
      if (value === 2) return 1;
      return value;
    };
    const alternative = SOLVED_BOARD.map((row) => row.map(swap));

    expect(alternative).not.toStrictEqual(SOLVED_BOARD);

    const state = alternative.map((row, r) =>
      row.map(
        (value, c): SudokuCell => ({
          value,
          type: 'input',
          state: 'idle',
          duplicated: false,
          answer: SOLVED_BOARD[r][c],
        }),
      ),
    );

    expect(getCorrectRatio(checkDuplicate(state))).toBe(100);
  });

  it('未入力のマスがあると100未満になる', () => {
    const board = SOLVED_BOARD.map((row) => [...row]);
    board[0][0] = Number.NaN;

    expect(getCorrectRatio(checkDuplicate(createState(board)))).toBeLessThan(100);
  });

  it('重複があると100未満になる', () => {
    const board = SOLVED_BOARD.map((row) => [...row]);
    board[0][0] = board[0][1];

    expect(getCorrectRatio(checkDuplicate(createState(board)))).toBeLessThan(100);
  });

  it('ヒントのマスは割合の計算に含めない', () => {
    // 入力マスは1行目の左から4マスだけ
    const state = checkDuplicate(
      createGameState((rowIndex, colIndex) => rowIndex === 0 && colIndex < 4).map((row, r) =>
        row.map((cell, c) => (r === 0 && c < 4 ? { ...cell, value: SOLVED_BOARD[r][c] } : cell)),
      ),
    );

    expect(getCorrectRatio(state)).toBe(100);

    const halfFilled = state.map((row, r) =>
      row.map((cell, c) => (r === 0 && 2 <= c && c < 4 ? { ...cell, value: Number.NaN } : cell)),
    );

    expect(getCorrectRatio(halfFilled)).toBe(50);
  });

  it('入力マスがない盤面は100を返す', () => {
    expect(getCorrectRatio(createGameState(() => false))).toBe(100);
  });

  it('ギブアップで埋まったマスは割合の計算に含めない', () => {
    // 入力マスは1行目の左から4マスだけ。うち2マスを自力で埋めた状態でギブアップする
    const state = createGameState((rowIndex, colIndex) => rowIndex === 0 && colIndex < 4).map((row, r) =>
      row.map((cell, c) => (r === 0 && c < 2 ? { ...cell, value: SOLVED_BOARD[r][c] } : cell)),
    );

    expect(getCorrectRatio(fillAnswer(state).sudoku)).toBe(50);
  });
});

describe('createLoadingState', () => {
  it('9×9すべてが読み込み中のマスになる', () => {
    const state = createLoadingState();

    expect(state).toHaveLength(9);
    expect(state.flat()).toHaveLength(81);
    expect(state.flat().every((cell) => cell.type === 'loading')).toBe(true);
  });

  it('重複も誤りの印も持たない', () => {
    expect(
      createLoadingState()
        .flat()
        .every((cell) => cell.duplicated === false && cell.state === 'idle'),
    ).toBe(true);
  });
});

describe('createSudokuState', () => {
  it('ヒントのマスには解答が入り、入力のマスは未入力になる', () => {
    const state = createSudokuState(50);

    expect(
      state.flat().every((cell) => (cell.type === 'hint' ? cell.value === cell.answer : Number.isNaN(cell.value))),
    ).toBe(true);
  });

  it('解答はルールを満たした完成盤面になる', () => {
    const answer = createSudokuState(50).map((row) => row.map((cell) => cell.answer));

    expect(solve(answer)).toStrictEqual({ status: 'solved', board: answer });
  });

  it('生成直後の盤面は重複なしと判定される', () => {
    expect(getDuplicatedCoords(checkDuplicate(createSudokuState(50)))).toStrictEqual([]);
  });

  it('割合が100ならすべてのマスが入力マスになる', () => {
    expect(
      createSudokuState(100)
        .flat()
        .every((cell) => cell.type === 'input'),
    ).toBe(true);
  });

  it('割合が0でも入力マスが1つだけ残る', () => {
    expect(
      createSudokuState(0)
        .flat()
        .filter((cell) => cell.type === 'input'),
    ).toHaveLength(1);
  });

  it('割合が低くても入力マスが必ず1つ以上できる', () => {
    for (let i = 0; i < 20; i++) {
      expect(
        createSudokuState(1)
          .flat()
          .some((cell) => cell.type === 'input'),
      ).toBe(true);
    }
  });
});

describe('resetInputs', () => {
  it('入力マスだけを未入力へ戻す', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 ? { ...cell, value: SOLVED_BOARD[r][c] } : cell)),
    );

    const result = resetInputs(state);

    expect(result[0].every((cell) => Number.isNaN(cell.value))).toBe(true);
    expect(
      result
        .slice(1)
        .flat()
        .every((cell) => cell.value === cell.answer),
    ).toBe(true);
  });

  it('重複と誤りの印を消す', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row) =>
      row.map((cell) => ({ ...cell, duplicated: true, state: 'invalid' as const })),
    );

    expect(
      resetInputs(state)
        .flat()
        .every((cell) => cell.duplicated === false && cell.state === 'idle'),
    ).toBe(true);
  });

  it('渡された盤面を破壊しない', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 ? { ...cell, value: SOLVED_BOARD[r][c] } : cell)),
    );

    resetInputs(state);

    expect(state[0].every((cell, c) => cell.value === SOLVED_BOARD[0][c])).toBe(true);
  });
});

describe('clearDuplicatedInputs', () => {
  /** 1行目を入力マスにし、左の2マスへ同じ数字を入れて重複させた盤面 */
  const createDuplicatedState = () =>
    checkDuplicate(
      createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
        row.map((cell, c) => (r === 0 && c < 2 ? { ...cell, value: SOLVED_BOARD[0][0] } : cell)),
      ),
    );

  it('重複している入力マスを空にして誤りの印を付ける', () => {
    const result = clearDuplicatedInputs(createDuplicatedState());

    expect(result[0].slice(0, 2).every((cell) => Number.isNaN(cell.value) && cell.state === 'invalid')).toBe(true);
  });

  it('空にしたマスの重複の印を落とす', () => {
    expect(getDuplicatedCoords(clearDuplicatedInputs(createDuplicatedState()))).toStrictEqual([]);
  });

  it('未入力のマスには誤りの印を付けない', () => {
    const result = clearDuplicatedInputs(createDuplicatedState());

    expect(result[0].slice(2).every((cell) => cell.state === 'idle')).toBe(true);
  });

  it('重複していないマスの誤りの印を消す', () => {
    const state = createDuplicatedState().map((row, r) =>
      row.map((cell, c) => (r === 0 && 4 <= c ? { ...cell, state: 'invalid' as const } : cell)),
    );

    expect(
      clearDuplicatedInputs(state)[0]
        .slice(4)
        .every((cell) => cell.state === 'idle'),
    ).toBe(true);
  });

  it('ヒントのマスの値は変えない', () => {
    const result = clearDuplicatedInputs(createDuplicatedState());

    expect(
      result
        .slice(1)
        .flat()
        .every((cell) => cell.value === cell.answer && cell.state === 'idle'),
    ).toBe(true);
  });

  it('入力に巻き込まれて重複と判定されたヒントの印も落とす', () => {
    // 1マスだけを入力マスにし、同じ行のヒントと同じ数字を入れる
    const state = checkDuplicate(
      createGameState((rowIndex, colIndex) => rowIndex === 0 && colIndex === 0).map((row, r) =>
        row.map((cell, c) => (r === 0 && c === 0 ? { ...cell, value: SOLVED_BOARD[0][1] } : cell)),
      ),
    );

    expect(getDuplicatedCoords(state)).toStrictEqual([
      [0, 0],
      [0, 1],
      [3, 0],
    ]);
    expect(getDuplicatedCoords(clearDuplicatedInputs(state))).toStrictEqual([]);
  });

  it('keepsBaseAnswer を指定すると、生成時の解答と一致する重複マスは残す', () => {
    const result = clearDuplicatedInputs(createDuplicatedState(), { keepsBaseAnswer: true });

    expect(result[0][0].value).toBe(SOLVED_BOARD[0][0]);
    expect(result[0][0].state).toBe('idle');
    expect(Number.isNaN(result[0][1].value)).toBe(true);
    expect(result[0][1].state).toBe('invalid');
  });
});

describe('markCorrectInputs', () => {
  it('埋まっている入力マスにだけ正解の印を付ける', () => {
    // 入力マスは1行目だけ。そのうち左から2マスを埋める
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c < 2 ? { ...cell, value: SOLVED_BOARD[r][c] } : cell)),
    );

    const result = markCorrectInputs(state);

    expect(result[0].slice(0, 2).every((cell) => cell.state === 'correct')).toBe(true);
    expect(result[0].slice(2).every((cell) => cell.state === 'idle')).toBe(true);
    expect(
      result
        .slice(1)
        .flat()
        .every((cell) => cell.state === 'idle'),
    ).toBe(true);
  });
});

describe('reviewInputs', () => {
  /** 1〜3行目を入力マスにした盤面。この3行は入れ替えても成立するため、別解を作れる */
  const createBandState = (getValue: (rowIndex: number, colIndex: number) => number) =>
    createGameState((rowIndex) => rowIndex < 3).map((row, r) =>
      row.map((cell, c) => (r < 3 ? { ...cell, value: getValue(r, c) } : cell)),
    );

  it('重複がなければ入力を消さない', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c === 0 ? { ...cell, value: SOLVED_BOARD[0][0] } : cell)),
    );
    const { sudoku, status } = reviewInputs(state);

    expect(status).toBe('solved');
    expect(sudoku[0][0].value).toBe(SOLVED_BOARD[0][0]);
    expect(sudoku.flat().some((cell) => cell.state === 'invalid')).toBe(false);
  });

  it('重複した入力のうち、生成時の解答と一致するものは残す', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c < 2 ? { ...cell, value: SOLVED_BOARD[0][0] } : cell)),
    );
    const { sudoku, status } = reviewInputs(state);

    expect(status).toBe('solved');
    expect(sudoku[0][0].value).toBe(SOLVED_BOARD[0][0]);
    expect(sudoku[0][0].state).toBe('correct');
    expect(Number.isNaN(sudoku[0][1].value)).toBe(true);
    expect(sudoku[0][1].state).toBe('invalid');
  });

  it('残った入力にだけ正解の印を付ける', () => {
    // 生成時の解答とは異なる別解。重複しないため1行すべてが残る
    const { sudoku, status } = reviewInputs(createBandState((r, c) => (r === 0 ? SOLVED_BOARD[1][c] : Number.NaN)));

    expect(status).toBe('solved');
    expect(sudoku[0].every((cell) => cell.state === 'correct')).toBe(true);
    // 未入力の入力マスとヒントのマスは正解の印を持たない
    expect(
      sudoku
        .slice(1)
        .flat()
        .every((cell) => cell.state === 'idle'),
    ).toBe(true);
  });

  it('残した入力のせいで完成できないなら、重複していた入力をすべて消す', () => {
    const state = createBandState((r, c) => {
      if (r === 0) {
        return SOLVED_BOARD[1][c];
      }

      // 生成時の解答と一致するが、1行目を埋め切った時点で置き場所がなくなっている
      if (r === 1 && c === 0) {
        return SOLVED_BOARD[1][0];
      }

      return Number.NaN;
    });
    const { sudoku, status } = reviewInputs(state);

    expect(status).toBe('solved');
    expect(Number.isNaN(sudoku[1][0].value)).toBe(true);
    expect(sudoku[1][0].state).toBe('invalid');
  });

  it('重複を消しても完成できないなら、生成時の解答と一致する入力は残す', () => {
    const state = createBandState((r, c) => {
      if (r === 0) {
        return SOLVED_BOARD[1][c];
      }

      // 重複しないが、1行目を2行目の解答にした以上この2マスは同時に成立しない
      if (r === 1 && c === 0) {
        return SOLVED_BOARD[0][0];
      }

      if (r === 1 && c === 6) {
        return SOLVED_BOARD[2][6];
      }

      // 行き詰まりの原因ではない重複。左は生成時の解答と一致する
      if (r === 2 && c < 2) {
        return SOLVED_BOARD[2][0];
      }

      return Number.NaN;
    });
    const { sudoku, status } = reviewInputs(state);

    expect(status).toBe('unsolvable');
    expect(sudoku[2][0].value).toBe(SOLVED_BOARD[2][0]);
    expect(sudoku[2][0].state).toBe('idle');
    expect(Number.isNaN(sudoku[2][1].value)).toBe(true);
    expect(sudoku[2][1].state).toBe('invalid');
    // 完成できない盤面では、残った入力も正解とは言えない
    expect(sudoku.flat().some((cell) => cell.state === 'correct')).toBe(false);
  });
});

describe('fillAnswer', () => {
  it('入力を残したまま盤面を完成させる', () => {
    // 1行目だけが空いている盤面の解は SOLVED_BOARD しかない
    const { sudoku, keepsOwnInput } = fillAnswer(createGameState((rowIndex) => rowIndex === 0));

    expect(keepsOwnInput).toBe(true);
    expect(sudoku.map((row) => row.map((cell) => cell.value))).toStrictEqual(SOLVED_BOARD);
  });

  it('生成時の解答と異なる入力でも、その入力を残したまま完成させる', () => {
    // 同じブロック行の中で行を入れ替えても数独は成立する
    const state = createGameState((rowIndex) => rowIndex < 3).map((row, r) =>
      row.map((cell, c) => (r === 0 ? { ...cell, value: SOLVED_BOARD[1][c] } : cell)),
    );

    const { sudoku, keepsOwnInput } = fillAnswer(state);

    expect(keepsOwnInput).toBe(true);
    expect(sudoku[0].map((cell) => cell.value)).toStrictEqual(SOLVED_BOARD[1]);
  });

  it('完成できない入力は生成時の解答で上書きする', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c === 0 ? { ...cell, value: SOLVED_BOARD[1][0] } : cell)),
    );

    const { sudoku, keepsOwnInput } = fillAnswer(state);

    expect(keepsOwnInput).toBe(false);
    expect(sudoku.map((row) => row.map((cell) => cell.value))).toStrictEqual(SOLVED_BOARD);
  });

  it('自力で埋めていたマスだけに正解の印を付ける', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c === 0 ? { ...cell, value: SOLVED_BOARD[0][0] } : cell)),
    );

    const { sudoku } = fillAnswer(state);

    expect(sudoku[0][0].state).toBe('correct');
    expect(sudoku[0].slice(1).every((cell) => cell.state === 'answer')).toBe(true);
  });

  it('生成時の解答と異なる入力でも、残したマスには正解の印を付ける', () => {
    const state = createGameState((rowIndex) => rowIndex < 3).map((row, r) =>
      row.map((cell, c) => (r === 0 ? { ...cell, value: SOLVED_BOARD[1][c] } : cell)),
    );

    const { sudoku } = fillAnswer(state);

    expect(sudoku[0].every((cell) => cell.state === 'correct')).toBe(true);
  });

  it('上書きしたマスには正解の印を付けない', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row, r) =>
      row.map((cell, c) => (r === 0 && c === 0 ? { ...cell, value: SOLVED_BOARD[1][0] } : cell)),
    );

    const { sudoku } = fillAnswer(state);

    expect(sudoku[0][0].state).toBe('answer');
  });

  it('埋めたマスから重複と誤りの印を消す', () => {
    const state = createGameState((rowIndex) => rowIndex === 0).map((row) =>
      row.map((cell) => ({ ...cell, duplicated: true, state: 'invalid' as const })),
    );

    const { sudoku } = fillAnswer(state);

    expect(sudoku.flat().every((cell) => cell.duplicated === false)).toBe(true);
  });

  it('渡された盤面を破壊しない', () => {
    const state = createGameState((rowIndex) => rowIndex === 0);

    fillAnswer(state);

    expect(state[0].every((cell) => Number.isNaN(cell.value))).toBe(true);
  });
});
