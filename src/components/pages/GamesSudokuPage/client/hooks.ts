'use client';

import {
  checkDuplicate,
  clearDuplicatedInputs,
  createLoadingState,
  createSudokuState,
  fillAnswer,
  getCorrectRatio,
  resetInputs,
} from '@/components/pages/GamesSudokuPage/utils';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { SudokuState } from '@/components/pages/GamesSudokuPage/utils';

const SAVEDATA_KEY = 'savedata-sudoku-game';
const DEFAULT_LEVEL = 50;

export interface SudokuSettings {
  shouldShowCorrectRatio: boolean;
  shouldShowHints: boolean;
  shouldHighLight: boolean;
}

const DEFAULT_SETTINGS: SudokuSettings = {
  shouldShowCorrectRatio: false,
  shouldShowHints: false,
  shouldHighLight: false,
};

/** 表示設定と難易度を保持する */
export const useSudokuSettings = () => {
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  // 「次の問題」ダイアログは開いた時点の内容を保持するため、スライダーの値を状態にしても表示へ反映されない。
  // ドラッグのたびに盤面を再描画させないためにも参照で持つ
  const levelRef = useRef(DEFAULT_LEVEL);

  useEffect(() => {
    const saveData = getLocalStorage(SAVEDATA_KEY);

    setSettings({
      shouldShowCorrectRatio: saveData?.shouldShowCorrectRatio ?? DEFAULT_SETTINGS.shouldShowCorrectRatio,
      shouldShowHints: saveData?.shouldShowHints ?? DEFAULT_SETTINGS.shouldShowHints,
      shouldHighLight: saveData?.shouldHighLight ?? DEFAULT_SETTINGS.shouldHighLight,
    });
    levelRef.current = saveData?.level ?? DEFAULT_LEVEL;

    setIsReady(true);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<SudokuSettings>) => {
      const next = { ...settings, ...patch };

      setSettings(next);
      setLocalStorage(SAVEDATA_KEY, { ...next, level: levelRef.current });
    },
    [settings],
  );

  const updateLevel = useCallback(
    (level: number) => {
      levelRef.current = level;
      setLocalStorage(SAVEDATA_KEY, {
        shouldShowHints: settings.shouldShowHints,
        shouldHighLight: settings.shouldHighLight,
        level,
      });
    },
    [settings],
  );

  return { isReady, settings, levelRef, updateSettings, updateLevel };
};

/** 盤面のフォーカスとホバーの位置を保持する */
export const useSudokuFocus = () => {
  const inputMapRef = useRef<HTMLInputElement[][]>([]);
  const [currentInput, setCurrentInput] = useState([0, 0, 0, 0]);
  const [hoverCoords, setHoverCoords] = useState([Number.NaN, Number.NaN]);

  const setGrid = useCallback((div: HTMLDivElement | null) => {
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
  }, []);

  const focusCenter = useCallback(() => {
    // 新しい盤面が描画されてからでないとフォーカスを移せないため、反映を待つ
    queueMicrotask(() => {
      setCurrentInput([4, 4]);
      inputMapRef.current[4]?.[4]?.focus({ preventScroll: true });
    });
  }, []);

  return { inputMapRef, currentInput, setCurrentInput, hoverCoords, setHoverCoords, setGrid, focusCenter };
};

export type SudokuFocus = ReturnType<typeof useSudokuFocus>;

export type SudokuGameState = 'playing' | 'give-up' | 'clear';

/** 盤面と進行状況を保持する */
export const useSudokuGame = () => {
  const [gameState, setGameState] = useState<SudokuGameState>('playing');
  const [sudokuState, setSudokuState] = useState<SudokuState>(createLoadingState);
  const [correctRatio, setCorrectRatio] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  /** level は入力マス（空欄）の割合（％） */
  const start = useCallback((level: number) => {
    setGameState('playing');
    setIsDirty(false);
    setCorrectRatio(0);
    setSudokuState(createSudokuState(level));
  }, []);

  /** 1マスへ数字を入力する。戻り値は入力後の進捗率 */
  const input = useCallback(
    ({ rowIndex, colIndex, value }: { rowIndex: number; colIndex: number; value: number }) => {
      const next = checkDuplicate(
        sudokuState.map((row, r) =>
          r === rowIndex
            ? row.map((cell, c) => (c === colIndex ? { ...cell, value, state: 'idle' as const } : cell))
            : row,
        ),
      );
      const ratio = getCorrectRatio(next);

      if (ratio === 100) {
        setSudokuState(clearDuplicatedInputs(next));
        setGameState('clear');
      } else {
        setSudokuState(next);
      }

      setCorrectRatio(ratio);

      return ratio;
    },
    [sudokuState],
  );

  const reset = useCallback(() => {
    setSudokuState(resetInputs(sudokuState));
  }, [sudokuState]);

  /** 重複している入力と未入力のマスへ印を付ける */
  const check = useCallback(() => {
    setSudokuState(clearDuplicatedInputs(checkDuplicate(sudokuState)));
  }, [sudokuState]);

  /** 答えを表示する */
  const giveUp = useCallback(() => {
    setGameState('give-up');
    setSudokuState(fillAnswer(sudokuState));
  }, [sudokuState]);

  useEffect(() => {
    if (isDirty === false) {
      return;
    }

    const onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    globalThis.window.addEventListener('beforeunload', onbeforeunload);

    return () => {
      globalThis.window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, [isDirty]);

  return { gameState, sudokuState, correctRatio, setIsDirty, start, input, reset, check, giveUp };
};
