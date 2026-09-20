/** 数字だけの盤面。空きマスは NaN で表す */
export type Board = number[][];

export type SolveResult = { status: 'solved'; board: Board } | { status: 'unsolvable' } | { status: 'unknown' };

export interface SudokuCell {
  value: number;
  type: 'hint' | 'input' | 'loading';
  /**
   * invalid と correct は正誤確認の結果で、入力し直すと idle へ戻る。
   * answer はギブアップで埋めたマス、correct はギブアップ時に自力で埋めていたマスにも付く。
   */
  state: 'idle' | 'invalid' | 'answer' | 'correct';
  duplicated: boolean;
  answer: number;
}

export type SudokuState = SudokuCell[][];
