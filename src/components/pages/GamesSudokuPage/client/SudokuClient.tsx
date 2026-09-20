'use client';

import { useSudokuFocus, useSudokuGame, useSudokuSettings } from '@/components/pages/GamesSudokuPage/client/hooks';
import { ProgressMeter, SudokuBoard, SudokuSettings } from '@/components/pages/GamesSudokuPage/client/parts';
import {
  TOAST_ANSWER_EXAMPLE,
  TOAST_CLEAR,
  TOAST_NEW_GAME,
  TOAST_NO_MISTAKE,
  TOAST_RESET,
  TOAST_UNSOLVABLE,
} from '@/components/pages/GamesSudokuPage/constants';
import { RunButton } from '@/components/ui/buttons/RunButton';
import { Confirm } from '@/components/ui/dialogs/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';
import { Toast } from '@/components/ui/dialogs/Toast';
import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { useAchievement } from '@/hooks/use-achievement';
import { useEffect, useState } from 'react';

export const SudokuClient = () => {
  const { isReady, settings, levelRef, updateSettings, updateLevel } = useSudokuSettings();
  const { gameState, sudokuState, correctRatio, setIsDirty, start, input, reset, check, giveUp } = useSudokuGame();
  const focus = useSudokuFocus();

  const { confirmData, setConfirmData } = useConfirm();
  const { toastProps: achievementToastProps, unlock } = useAchievement();
  const [toastMessage, setToastMessage] = useState('');

  const handleNewGame = () => {
    start(levelRef.current);
    focus.focusCenter();
  };

  useEffect(() => {
    if (isReady) {
      start(levelRef.current);
    }
  }, [isReady, levelRef, start]);

  if (isReady === false) {
    return (
      <p className="grid aspect-video place-items-center">
        <LoadingIcon />
      </p>
    );
  }

  return (
    <>
      <div className="w800px:grid w800px:gap-8 transition-discrete starting:opacity-0 w800px:items-start grid-cols-[auto_var(--spacing-260PX)] gap-4 transition-opacity">
        <SudokuBoard
          gameState={gameState}
          sudoku={sudokuState}
          focus={focus}
          shouldShowHints={settings.shouldShowHints}
          shouldHighLight={settings.shouldHighLight}
          onInput={() => {
            setIsDirty(true);
          }}
          onChangeCell={(cell) => {
            if (input(cell) !== 100) {
              return;
            }

            unlock('worth-not-quitting');
            setToastMessage(TOAST_CLEAR);
          }}
        />

        <div className="w800px:mt-0 w800:flex w800:flex-col @container mt-8 w-full">
          <ul className="@w360:grid-cols-2 @w640:grid-cols-4 grid grid-cols-1 gap-4">
            <li>
              <RunButton
                disabled={gameState !== 'playing' && gameState !== 'clear'}
                onClick={() => {
                  setConfirmData({
                    message: '本当にリセットしてよろしいですか？',
                    yes: () => {
                      reset();
                      setToastMessage(TOAST_RESET);
                    },
                    no: () => {},
                  });
                }}
              >
                リセット
              </RunButton>
            </li>
            <li>
              <RunButton
                disabled={gameState !== 'playing'}
                onClick={() => {
                  const { removed, status } = check();

                  if (status === 'unsolvable') {
                    setToastMessage(TOAST_UNSOLVABLE);
                    return;
                  }

                  // 重複を消したこと自体が結果の表示になるため、何も直さなかったときだけ明示する
                  if (removed === false && status === 'solved') {
                    setToastMessage(TOAST_NO_MISTAKE);
                  }
                }}
              >
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
                      unlock('the-art-of-giving-up', 1000);

                      if (giveUp() === false) {
                        setToastMessage(TOAST_ANSWER_EXAMPLE);
                      }
                    },
                    no: () => {},
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
                        <label className="border-secondary block rounded-xl border px-2 pt-1 [corner-shape:squircle]">
                          <span className="block text-sm">{`非表示の割合：${levelRef.current}%`}</span>
                          <span>
                            <input
                              type="range"
                              defaultValue={levelRef.current}
                              min={1}
                              max={90}
                              onChange={(e) => {
                                const level = Number(e.currentTarget.value);
                                const label = e.currentTarget.parentElement?.previousElementSibling;

                                updateLevel(level);

                                // ダイアログは開いた時点の内容を保ち続けるため、表示は直接書き換える
                                if (label) {
                                  label.textContent = `非表示の割合：${level}%`;
                                }
                              }}
                              className="w-full"
                            />
                          </span>
                        </label>
                      </p>
                    ),
                    yes: () => {
                      handleNewGame();
                      setToastMessage(TOAST_NEW_GAME);
                    },
                    no: () => {},
                  });
                }}
              >
                次の問題
              </RunButton>
            </li>
          </ul>

          <SudokuSettings settings={settings} onChangeSettings={updateSettings} />

          <ProgressMeter ratio={correctRatio} isHidden={settings.shouldShowCorrectRatio === false} />
        </div>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} assertive />
      <Toast {...achievementToastProps} />
      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
    </>
  );
};
