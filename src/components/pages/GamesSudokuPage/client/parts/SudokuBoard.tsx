'use client';

import type { SudokuFocus, SudokuGameState } from '@/components/pages/GamesSudokuPage/client/hooks';
import type { SudokuState } from '@/components/pages/GamesSudokuPage/utils';
import { formatStringToNumericString } from '@/utils/formatter';
import clsx from 'clsx';
import type { ChangeEvent } from 'react';

/** 入力途中の文字列ではなく、確定した1桁だけを取り出す */
const readValue = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.nativeEvent instanceof InputEvent) {
    const inputValue = e.nativeEvent.data ?? '';

    if (/^\d$/.test(inputValue)) {
      return Number(inputValue);
    }
  }

  // 0は数独で使わないため、Number()が0を返す入力は未入力として扱う
  return Number(formatStringToNumericString(e.target.value)) || Number.NaN;
};

interface Props {
  gameState: SudokuGameState;
  sudoku: SudokuState;
  focus: SudokuFocus;
  shouldShowHints: boolean;
  shouldHighLight: boolean;
  onInput: () => void;
  onChangeCell: (input: { rowIndex: number; colIndex: number; value: number }) => void;
}

export const SudokuBoard = ({
  gameState,
  sudoku,
  focus,
  shouldShowHints,
  shouldHighLight,
  onInput,
  onChangeCell,
}: Props) => {
  const { inputMapRef, currentInput, setCurrentInput, hoverCoords, setHoverCoords, setGrid } = focus;

  /** 矢印キーの移動先。端まで来たら反対側へ回り込む */
  const getNeighbor = ({ key, rowIndex, colIndex }: { key: string; rowIndex: number; colIndex: number }) => {
    const map = inputMapRef.current;

    switch (key) {
      case 'ArrowRight':
        return map[rowIndex]?.[colIndex + 1] ?? map[rowIndex]?.[0];
      case 'ArrowLeft':
        return map[rowIndex]?.[colIndex - 1] ?? map[rowIndex]?.[8];
      case 'ArrowUp':
        return map[rowIndex - 1]?.[colIndex] ?? map[8]?.[colIndex];
      case 'ArrowDown':
        return map[rowIndex + 1]?.[colIndex] ?? map[0]?.[colIndex];
      default:
        return undefined;
    }
  };

  return (
    <div
      className="border-secondary group mx-auto table w-full table-fixed border-collapse border-4 leading-none"
      ref={setGrid}
      onMouseLeave={() => {
        setHoverCoords([Number.NaN, Number.NaN]);
      }}
      onInput={onInput}
    >
      {sudoku.map((row, rowIndex) => (
        <div key={rowIndex} className="table-row">
          {row.map(({ value, type, state, duplicated }, colIndex) => {
            const isHoverCurrent = hoverCoords[0] === rowIndex && hoverCoords[1] === colIndex;
            const isHoverRowOrColumn = hoverCoords[0] === rowIndex || hoverCoords[1] === colIndex;
            const isFocusCurrent = currentInput[0] === rowIndex && currentInput[1] === colIndex;
            const isFocusRowOrColumn = currentInput[0] === rowIndex || currentInput[1] === colIndex;
            // ホバーでフォーカス位置を退避しているあいだは、退避前の位置をタブ順の入口にする
            const isTabTarget =
              Number.isNaN(currentInput[0]) || Number.isNaN(currentInput[1])
                ? currentInput[2] === rowIndex && currentInput[3] === colIndex
                : isFocusCurrent;
            // ギブアップとクリアは結果の表示そのもののため、ヒントの設定に関わらず正解を示す
            const isCorrect = state === 'correct' && (gameState !== 'playing' || shouldShowHints);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={clsx([
                  'w800px:size-[min(5vw,4rem)] transition-bg border-secondary table-cell border',
                  rowIndex % 3 === 0 && 'border-t-4',
                  colIndex !== 0 && colIndex % 3 === 0 && 'border-l-4',
                  type === 'input'
                    ? [state === 'invalid' && 'bg-error text-high-contrast']
                    : [gameState === 'give-up' ? 'bg-high-contrast text-high-contrast-reverse' : ''],
                ])}
              >
                <input
                  inputMode="numeric"
                  tabIndex={isTabTarget ? 0 : -1}
                  className={clsx([
                    'w500:text-[max(4vw,1rem)] w800px:text-[min(4vw,3rem)] focus:z-1 relative aspect-square w-full text-center text-[clamp(16px,5rem,20px)] transition-[color] focus:rounded-lg',
                    Number.isNaN(value) && 'text-transparent',
                    type === 'hint' && 'cursor-default font-bold',
                    type !== 'hint' && 'font-mono',

                    shouldShowHints && duplicated && 'text-alert',
                    isCorrect && 'text-success',

                    shouldHighLight && isHoverCurrent && 'bg-cyan-800/15',
                    shouldHighLight && isHoverCurrent === false && isHoverRowOrColumn && 'bg-cyan-800/10',

                    shouldHighLight && isFocusCurrent && 'group-focus-within:bg-cyan-800/15',
                    shouldHighLight &&
                      isFocusCurrent === false &&
                      isFocusRowOrColumn &&
                      'group-focus-within:bg-cyan-800/10',
                  ])}
                  value={Number.isNaN(value) ? '' : value}
                  title={`${rowIndex + 1}行目${colIndex + 1}列目`}
                  aria-invalid={duplicated || state === 'invalid'}
                  readOnly={type === 'hint' || gameState !== 'playing'}
                  onMouseEnter={() => {
                    setHoverCoords([rowIndex, colIndex]);
                    setCurrentInput((prev) => {
                      if (Number.isNaN(prev[1])) {
                        return prev;
                      }

                      return [Number.NaN, Number.NaN, prev[0], prev[1]];
                    });
                  }}
                  onPointerUp={(e) => {
                    e.currentTarget?.setSelectionRange(0, 1);
                  }}
                  onFocus={() => {
                    setCurrentInput([rowIndex, colIndex]);
                    setHoverCoords([Number.NaN, Number.NaN]);
                  }}
                  onChange={(e) => {
                    const value = readValue(e);

                    if ((1 <= value && value <= 9) || Number.isNaN(value)) {
                      onChangeCell({ rowIndex, colIndex, value });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();

                      const inputs = inputMapRef.current.flat();
                      const index = inputs.indexOf(e.currentTarget);
                      const editable = (input: HTMLInputElement) => input.readOnly === false;
                      // 末尾まで来たら先頭から探し直し、入力できるマスだけを順に辿る
                      const target = e.shiftKey
                        ? (inputs.slice(0, index).findLast(editable) ?? inputs.findLast(editable))
                        : (inputs.slice(index + 1).find(editable) ?? inputs.find(editable));

                      (target ?? inputs[0])?.focus();

                      return;
                    }

                    const neighbor = getNeighbor({ key: e.key, rowIndex, colIndex });

                    if (neighbor) {
                      e.preventDefault();
                      neighbor.focus();
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
