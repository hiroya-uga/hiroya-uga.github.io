/** 数字だけの盤面。空きマスは NaN で表す */
export type Board = number[][];

export interface SudokuCell {
  value: number;
  type: 'hint' | 'input' | 'loading';
  state: 'idle' | 'invalid' | 'answer';
  duplicated: boolean;
  answer: number;
}

export type SudokuState = SudokuCell[][];
