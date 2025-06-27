'use client';

import { RunButton } from '@/components/Clickable';
import { Confirm, Toast } from '@/components/Dialog';
import { useConfirm } from '@/components/Dialog/confirm-hooks';
import { Switch } from '@/components/Form';
import { LoadingIcon } from '@/components/Icons';
import { arrayShuffle } from '@/utils/array-shuffle';
import { formatStringToNumericString } from '@/utils/formatter';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

type Sudoku = number[][];
type SudokuState = {
  value: number;
  type: 'hint' | 'input' | 'loading';
  state: 'idle' | 'valid' | 'invalid' | 'answer';
  duplicated: boolean;
  answer: number;
}[][];

/** AIパワー */
const generate = () => {
  const isDuplicated = ({ sudoku, row, col, num }: { sudoku: Sudoku; row: number; col: number; num: number }) => {
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
  const loop = (sudoku: Sudoku) => {
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
            sudoku[row][col] = NaN;
            continue;
          }
          return true;
        }

        return false; // どの数字も入らなければ戻る
      }
    }
    return true; // すべて埋まった
  };

  const sudoku = Array.from({ length: 9 }, () => Array(9).fill(NaN));
  loop(sudoku);
  return sudoku;
};

/** AIパワー */
const checkDuplicate = (sudoku: SudokuState) => {
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
export const SudokuClient = () => {
  const [isReady, setIsReady] = useState(false);

  const [gameState, setGameState] = useState<'playing' | 'give-up' | 'clear'>('playing');

  const { confirmData, setConfirmData } = useConfirm();
  const [toastMessage, setToastMessage] = useState('');
  const [shouldShowCorrectRatio, setShouldShowCorrectRatio] = useState(false);
  const [shouldShowHints, setShouldShowHints] = useState(false);
  const [shouldHighLight, setShouldHighLight] = useState(false);
  const [correctRatio, setCorrectRatio] = useState(0);
  const levelRef = useRef(50);
  const [isDirty, setIsDirty] = useState(false);

  const [sudokuState, setSudokuState] = useState<SudokuState>(
    Array.from({ length: 9 }, () => Array(9).fill({ value: NaN, type: 'loading', state: 'idle', answer: NaN })),
  );
  const [hoverCoords, setHoverCoords] = useState([NaN, NaN]);
  const [currentInput, setCurrentInput] = useState([0, 0, 0, 0]);
  const inputMapRef = useRef<HTMLInputElement[][]>([]);
  const newGame = useCallback(() => {
    setGameState('playing');
    setIsDirty(false);
    setCorrectRatio(0);

    return new Promise((resolve) => {
      const sudoku = generate();
      const levelValue = 1 - Math.abs((100 - levelRef.current) / 100);

      setSudokuState(
        sudoku.map((row) =>
          row.map((num) => {
            const type = Math.random() < levelValue ? 'input' : 'hint';
            const value = type === 'input' ? NaN : num;

            return { value, type, answer: num, state: 'idle', duplicated: false };
          }),
        ),
      );
      resolve(null);
    });
  }, []);

  const showAnswer = useCallback(() => {
    setSudokuState((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          if (cell.type === 'input' && cell.value !== cell.answer) {
            return { ...cell, value: NaN, state: 'invalid' };
          }
          return { ...cell, state: 'valid' };
        }),
      ),
    );
  }, []);

  useEffect(() => {
    if (isReady) {
      newGame();
      return;
    }

    const saveData = getLocalStorage('savedata-sudoku-game');

    if (typeof saveData?.shouldShowCorrectRatio !== 'undefined') {
      setShouldShowCorrectRatio(saveData.shouldShowCorrectRatio);
    }

    if (typeof saveData?.shouldShowHints !== 'undefined') {
      setShouldShowHints(saveData.shouldShowHints);
    }

    if (typeof saveData?.shouldHighLight !== 'undefined') {
      setShouldHighLight(saveData.shouldHighLight);
    }

    if (typeof saveData?.level !== 'undefined') {
      levelRef.current = saveData.level;
    }

    setIsReady(true);
  }, [isReady, newGame]);

  useEffect(() => {
    if (isDirty) {
      const onbeforeunload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', onbeforeunload);
      return () => {
        window.removeEventListener('beforeunload', onbeforeunload);
      };
    }
  }, [isDirty]);

  if (isReady === false) {
    return (
      <p className="grid aspect-video place-items-center">
        <LoadingIcon />
      </p>
    );
  }

  return (
    <>
      <div className="@w800px:grid @w800px:gap-8 transition-discrete starting:opacity-0 @w800px:items-start grid-cols-[auto_var(--spacing-260PX)] gap-4 transition-opacity">
        <div
          className="group mx-auto table w-full table-fixed border-collapse border-4 border-black leading-none"
          ref={(div) => {
            if (div === null) {
              inputMapRef.current = [];
              return;
            }

            const inputs = [...div.querySelectorAll<HTMLInputElement>('input')];
            const result = [];

            for (let i = 0; i < inputs.length; i += 9) {
              result.push(inputs.slice(i, i + 9));
            }

            inputMapRef.current = result;
          }}
          onMouseLeave={() => {
            setHoverCoords([NaN, NaN]);
          }}
          onInput={() => {
            setIsDirty(true);
          }}
        >
          {sudokuState.map((row, rowIndex) => (
            <div key={rowIndex} className="table-row">
              {row.map(({ value, type, state, duplicated }, colIndex) => {
                const isHoverCurrent = hoverCoords[0] === rowIndex && hoverCoords[1] === colIndex;
                const isHoverRowOrColumn = hoverCoords[0] === rowIndex || hoverCoords[1] === colIndex;
                const isFocusCurrent = currentInput[0] === rowIndex && currentInput[1] === colIndex;
                const isFocusRowOrColumn = currentInput[0] === rowIndex || currentInput[1] === colIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={clsx([
                      '@w800px:size-[min(5vw,4rem)] table-cell border border-black transition-[background-color]',
                      rowIndex % 3 === 0 && 'border-t-4',
                      colIndex !== 0 && colIndex % 3 === 0 && 'border-l-4',
                      type === 'input' && state === 'invalid' && 'bg-red-200',
                      type === 'input' && state === 'valid' && 'bg-green-200',
                    ])}
                  >
                    <input
                      inputMode="numeric"
                      tabIndex={(() => {
                        if (Number.isNaN(currentInput[0]) || Number.isNaN(currentInput[1])) {
                          return currentInput[2] === rowIndex && currentInput[3] === colIndex ? 0 : -1;
                        }
                        return currentInput[0] === rowIndex && currentInput[1] === colIndex ? 0 : -1;
                      })()}
                      className={clsx([
                        'w500:text-[max(4vw,1rem)] @w800px:text-[min(4vw,3rem)] relative aspect-square w-full text-center text-[clamp(16px,5rem,20px)] transition-[color] focus:z-[1] focus:rounded-lg',
                        Number.isNaN(value) && 'text-transparent',
                        type === 'hint' && 'cursor-default font-bold',
                        type !== 'hint' && 'font-mono',

                        shouldShowHints && duplicated && 'text-alert',

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
                      readOnly={type === 'hint' || state === 'answer' || state === 'valid'}
                      onMouseEnter={() => {
                        setHoverCoords([rowIndex, colIndex]);
                        setCurrentInput((prev) => {
                          if (Number.isNaN(prev[1]) || Number.isNaN(prev[1])) {
                            return prev;
                          }

                          return [NaN, NaN, prev[0], prev[1]];
                        });
                      }}
                      onPointerUp={(e) => {
                        e.currentTarget?.setSelectionRange(0, 1);
                      }}
                      onFocus={() => {
                        setCurrentInput([rowIndex, colIndex]);
                        setHoverCoords([NaN, NaN]);
                      }}
                      onChange={(e) => {
                        const value = (() => {
                          if (e.nativeEvent instanceof InputEvent) {
                            const inputValue = e.nativeEvent.data ?? '';

                            if (/^[0-9]$/.test(inputValue)) {
                              return Number(inputValue);
                            }
                          }

                          return Number(formatStringToNumericString(e.target.value)) || NaN;
                        })();

                        if ((1 <= value && value <= 9) || Number.isNaN(value)) {
                          setSudokuState((prev) => {
                            const newSudoku = [...prev];
                            newSudoku[rowIndex][colIndex].value = value;

                            const result = checkDuplicate(newSudoku);

                            const input = [...result].flat().filter((item) => item.type === 'input');
                            const inputLength = input.length;
                            const correctLength = input.filter((item) => item.value === item.answer).length;
                            const ratio = Math.floor((correctLength / inputLength) * 10000) / 100;

                            if (ratio === 100) {
                              showAnswer();
                              setGameState('clear');
                              setConfirmData({
                                message: 'おめでとうございます！',
                                children: (
                                  <>
                                    <p>ゲームクリアです！</p>
                                    <p>次の問題へ進みますか？</p>
                                  </>
                                ),
                                yes: () => {
                                  newGame().then(() => {
                                    setCurrentInput([4, 4]);
                                    inputMapRef.current[4][4]?.focus({ preventScroll: true });
                                  });
                                },
                                no: () => {
                                  return;
                                },
                              });
                            }

                            setCorrectRatio(ratio);

                            return result;
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        switch (e.key) {
                          case 'Enter': {
                            e.preventDefault();

                            const inputs = inputMapRef.current.flat();
                            const index = inputs.indexOf(e.currentTarget);

                            const target = (() => {
                              if (e.shiftKey) {
                                return (
                                  inputs.slice(0, index).findLast((input) => input.readOnly === false) ||
                                  inputs.findLast((input) => input.readOnly === false)
                                );
                              }
                              return (
                                inputs.slice(index + 1).find((input) => input.readOnly === false) ||
                                inputs.find((input) => input.readOnly === false)
                              );
                            })();

                            if (target) {
                              target.focus();
                              return;
                            }

                            inputs[0]?.focus();

                            break;
                          }
                          case 'ArrowRight': {
                            e.preventDefault();
                            const next = inputMapRef.current[rowIndex][colIndex + 1];

                            if (next) {
                              next.focus();
                            } else {
                              inputMapRef.current[rowIndex][0]?.focus();
                            }

                            break;
                          }
                          case 'ArrowLeft': {
                            e.preventDefault();
                            const next = inputMapRef.current[rowIndex][colIndex - 1];

                            if (next) {
                              next.focus();
                            } else {
                              inputMapRef.current[rowIndex][8]?.focus();
                            }

                            break;
                          }
                          case 'ArrowUp': {
                            e.preventDefault();
                            const next = inputMapRef.current[rowIndex - 1]?.[colIndex];

                            if (next) {
                              next.focus();
                            } else {
                              inputMapRef.current[8][colIndex]?.focus();
                            }

                            break;
                          }
                          case 'ArrowDown': {
                            e.preventDefault();
                            const next = inputMapRef.current[rowIndex + 1]?.[colIndex];

                            if (next) {
                              next.focus();
                            } else {
                              inputMapRef.current[0][colIndex]?.focus();
                            }

                            break;
                          }
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="@w800px:mt-0 @w800:flex @w800:flex-col mt-8 w-full">
          <ul className="@w500:grid-cols-2 @w700:grid-cols-4 @w800:grid-cols-1 grid grid-cols-1 gap-4">
            <li>
              <RunButton
                disabled={gameState !== 'playing' && gameState !== 'clear'}
                onClick={() => {
                  setConfirmData({
                    message: '本当にリセットしてよろしいですか？',
                    yes: () => {
                      setToastMessage('リセットしました');
                      setSudokuState((prev) =>
                        prev.map((row) =>
                          row.map((cell) => {
                            if (cell.type === 'input') {
                              return { ...cell, value: NaN, state: 'idle' };
                            }
                            return cell;
                          }),
                        ),
                      );
                    },
                    no: () => {
                      return;
                    },
                  });
                }}
              >
                リセット
              </RunButton>
            </li>
            <li>
              <RunButton disabled={gameState !== 'playing'} onClick={showAnswer}>
                正誤確認
              </RunButton>
            </li>
            <li>
              <RunButton
                disabled={gameState !== 'playing'}
                onClick={() => {
                  setConfirmData({
                    message: '答えを表示していいですか？',
                    yes: () => {
                      setGameState('give-up');
                      setSudokuState((prev) =>
                        prev.map((row) =>
                          row.map((cell) => {
                            if (cell.type === 'input') {
                              if (cell.value === cell.answer) {
                                return { ...cell, value: cell.answer, state: 'valid' };
                              }
                              return { ...cell, value: cell.answer, state: 'answer' };
                            }
                            return cell;
                          }),
                        ),
                      );
                    },
                    no: () => {
                      return;
                    },
                  });
                }}
              >
                ギブアップ
              </RunButton>
            </li>
            <li>
              <RunButton
                onClick={() => {
                  setConfirmData({
                    message: '問題を再生成します。よろしいですか？',
                    children: (
                      <p>
                        <label className="block rounded-lg border border-gray-400 px-2 pt-1">
                          <span className="block text-sm">{`非表示の割合：${levelRef.current}%`}</span>
                          <span>
                            <input
                              type="range"
                              defaultValue={levelRef.current}
                              min={20}
                              max={90}
                              onChange={(e) => {
                                levelRef.current = Number(e.currentTarget.value);

                                const label = e.currentTarget.parentElement?.previousElementSibling;
                                if (label) {
                                  levelRef.current = Number(e.currentTarget.value);
                                  label.textContent = `非表示の割合：${levelRef.current}%`;
                                  setLocalStorage('savedata-sudoku-game', {
                                    shouldShowHints,
                                    shouldHighLight,
                                    level: levelRef.current,
                                  });
                                }
                              }}
                              className="w-full"
                            />
                          </span>
                        </label>
                      </p>
                    ),
                    yes: () => {
                      setToastMessage('問題を再生成しました。');
                      setGameState('playing');
                      newGame().then(() => {
                        setCurrentInput([4, 4]);
                        inputMapRef.current[4][4]?.focus({ preventScroll: true });
                      });
                    },
                    no: () => {
                      return;
                    },
                  });
                }}
              >
                次の問題
              </RunButton>
            </li>
          </ul>

          <div className="mt-5 space-y-4 border-t border-dashed border-t-gray-600 pt-5">
            <p>
              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-400 px-2 py-3">
                <span className="grow text-sm">ハイライト表示</span>
                <span>
                  <Switch
                    checked={shouldHighLight}
                    dispatch={setShouldHighLight}
                    onChange={(e) => {
                      setLocalStorage('savedata-sudoku-game', {
                        shouldShowCorrectRatio,
                        shouldShowHints,
                        shouldHighLight: e.currentTarget.checked,
                        level: levelRef.current,
                      });
                    }}
                  />
                </span>
              </label>
            </p>
            <p>
              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-400 px-2 py-3">
                <span className="grow text-sm">重複ヒント表示</span>
                <span>
                  <Switch
                    checked={shouldShowHints}
                    dispatch={setShouldShowHints}
                    onChange={(e) => {
                      setLocalStorage('savedata-sudoku-game', {
                        shouldShowCorrectRatio,
                        shouldShowHints: e.currentTarget.checked,
                        shouldHighLight,
                        level: levelRef.current,
                      });
                    }}
                  />
                </span>
              </label>
            </p>
            <p>
              <label className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-400 px-2 py-3">
                <span className="grow text-sm">進捗率を表示</span>
                <span>
                  <Switch
                    checked={shouldShowCorrectRatio}
                    dispatch={setShouldShowCorrectRatio}
                    onChange={(e) => {
                      setLocalStorage('savedata-sudoku-game', {
                        shouldShowCorrectRatio: e.currentTarget.checked,
                        shouldShowHints,
                        shouldHighLight,
                        level: levelRef.current,
                      });
                    }}
                  />
                </span>
              </label>
            </p>
          </div>

          <p
            className={clsx([
              'px-9px @w800px:py-0 @w800px:pr-0 @w800px:pt-5 transition-fade starting:opacity-0 @w800px:block transition-discrete sticky bottom-0 mt-5 flex grow items-center justify-between gap-2 border-t border-dashed border-t-gray-600 bg-[var(--v-color-background)] py-2 font-bold',
              shouldShowCorrectRatio === false && 'invisible opacity-0',
            ])}
          >
            <span className="block text-sm">進捗率</span>
            <span className="@w800px:text-[min(80px,6vw)] block text-right text-2xl leading-[1.75]" aria-hidden="true">
              {correctRatio}
              <span className="@w800px:text-[0.5em]">%</span>
            </span>
            <span className="sr-only" aria-live="polite" aria-atomic="true">{`${correctRatio}%`}</span>
          </p>
        </div>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} />
      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
    </>
  );
};
