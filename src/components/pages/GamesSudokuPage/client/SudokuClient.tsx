'use client';

import { useSudokuFocus, useSudokuGame, useSudokuSettings } from '@/components/pages/GamesSudokuPage/client/hooks';
import { ProgressMeter, SudokuBoard, SudokuSettings } from '@/components/pages/GamesSudokuPage/client/parts';
import { RunButton } from '@/components/ui/buttons/RunButton';
import { Confirm } from '@/components/ui/dialogs/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';
import { Toast } from '@/components/ui/dialogs/Toast';
import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { useEffect, useState } from 'react';

export const SudokuClient = () => {
  const { isReady, settings, levelRef, updateSettings, updateLevel } = useSudokuSettings();
  const { gameState, sudokuState, correctRatio, setIsDirty, start, input, reset, check, giveUp } = useSudokuGame();
  const focus = useSudokuFocus();

  const { confirmData, setConfirmData } = useConfirm();
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

            setConfirmData({
              message: 'おめでとうございます！',
              children: (
                <>
                  <p>ゲームクリアです！</p>
                  <p>次の問題へ進みますか？</p>
                </>
              ),
              yes: handleNewGame,
              no: () => {},
            });
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
                      setToastMessage('リセットしました');
                      reset();
                    },
                    no: () => {},
                  });
                }}
              >
                リセット
              </RunButton>
            </li>
            <li>
              <RunButton disabled={gameState !== 'playing'} onClick={check}>
                正誤確認
              </RunButton>
            </li>
            <li>
              <RunButton
                disabled={gameState !== 'playing'}
                onClick={() => {
                  setConfirmData({
                    message: '答えを表示していいですか？',
                    yes: giveUp,
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
                              min={20}
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
                      setToastMessage('問題を再生成しました。');
                      handleNewGame();
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

      <Toast message={toastMessage} setMessage={setToastMessage} />
      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
    </>
  );
};
