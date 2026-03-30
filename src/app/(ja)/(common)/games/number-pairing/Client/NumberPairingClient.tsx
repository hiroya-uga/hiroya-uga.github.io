'use client';

import { Toast } from '@/components/Dialog';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import {
  activeButtons,
  generateButtons,
  generateMode2Buttons,
  hasAvailableMove,
  hasValidPair,
  nextButtonCount,
  type Button,
  type GameMode,
  type GameStatus,
} from './logics';
import { ModeSelect } from './ModeSelect';

export function NumberPairingClient() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [stage, setStage] = useState(1);
  // ボタン数（モード1・2 共通）
  const [currentCount, setCurrentCount] = useState(2);
  const [buttons, setButtons] = useState<Button[]>([]);
  const [initialButtons, setInitialButtons] = useState<Button[]>([]);
  const [selected, setSelected] = useState<Button | null>(null);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [toastMessage, setToastMessage] = useState('');

  const startStage = (btns: Button[]) => {
    setInitialButtons(btns);
    setButtons(btns);
    setSelected(null);
    setStatus('playing');
  };

  useEffect(() => {
    if (gameMode === null) return;
    const gen = gameMode === '1' ? () => generateButtons(2) : () => generateMode2Buttons(2);
    queueMicrotask(() => startStage(gen()));
  }, [gameMode]);

  const handleRetry = () => {
    startStage(initialButtons);
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setStage(1);
    setCurrentCount(2);
    setSelected(null);
    setStatus('playing');
  };

  const handleClick = (btn: Button) => {
    if (status !== 'playing' || btn.cleared) return;

    // 選択解除
    if (selected?.id === btn.id) {
      setSelected(null);
      return;
    }

    // 1つ目の選択
    if (!selected) {
      setSelected(btn);
      return;
    }

    // 2つ目の選択 → 判定
    const sum = selected.value + btn.value;
    setSelected(null);

    if (sum === 10) {
      // ペア成立 → 両方を invisible に
      const next = buttons.map((b) => (b.id === selected.id || b.id === btn.id ? { ...b, cleared: true } : b));
      setButtons(next);
      if (activeButtons(next).length === 0) {
        // ステージクリア
        const nextCount = nextButtonCount(currentCount);
        setStage(stage + 1);
        setCurrentCount(nextCount);
        startStage(gameMode === '1' ? generateButtons(nextCount) : generateMode2Buttons(nextCount));
        setToastMessage(`ステージ ${stage + 1}`);
      } else if (gameMode === '1' && !hasValidPair(next)) {
        setStatus('game-over');
        setToastMessage('ゲームオーバー');
      } else if (gameMode === '2' && !hasAvailableMove(next)) {
        setStatus('game-over');
        setToastMessage('ゲームオーバー');
      }
    } else if (gameMode === '2' && sum < 10) {
      // 合体 → selected の位置を合体値に更新
      const next = buttons.map((b) => {
        if (b.id === selected.id) return { ...b, value: sum, isSum: true };
        if (b.id === btn.id) return { ...b, cleared: true };
        return b;
      });
      setButtons(next);
      if (!hasAvailableMove(next)) {
        setStatus('game-over');
        setToastMessage('ゲームオーバー');
      }
    }
  };

  if (gameMode === null) {
    return (
      <div className="mb-4">
        <ModeSelect onSelect={handleModeSelect} />
      </div>
    );
  }

  const cols = Math.ceil(Math.sqrt(buttons.length));
  const rows: Button[][] = [];
  for (let i = 0; i < buttons.length; i += cols) {
    rows.push(buttons.slice(i, i + cols));
  }

  return (
    <>
      <p aria-live="assertive" className="mb-7 text-center text-2xl">
        <b>{`ステージ ${stage}`}</b>
      </p>
      <div className="mb-6 overflow-auto">
        <table className="mx-auto" role="grid">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((btn) => (
                  <td key={btn.id} className="p-1">
                    <button
                      type="button"
                      onClick={() => handleClick(btn)}
                      tabIndex={btn.cleared ? -1 : 0}
                      disabled={btn.cleared}
                      className={clsx(
                        'border-3 aspect-square min-w-[clamp(44px,3rem,56px)] rounded-lg text-3xl font-bold leading-none transition-colors',
                        status === 'playing' && [
                          selected?.id !== btn.id && 'bg-panel-primary border-primary',
                          selected?.id === btn.id &&
                            'border-double border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30',
                          btn.cleared === false && ['hover:bg-panel-primary-hover', btn.isSum && 'bg-success'],
                        ],
                        status === 'game-over' && 'bg-alert border-alert text-high-contrast-reverse',
                        btn.cleared && 'opacity-20',
                      )}
                    >
                      {btn.value}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gameMode === '2' && (
        <p aria-live="assertive" className="min-h-lh text-alert mb-10 text-center text-2xl font-bold">
          {status === 'game-over' ? 'GAME OVER' : ''}
        </p>
      )}

      <div
        className={clsx([
          'mx-auto w-fit',
          gameMode === '1' && 'mt-109px',
          gameMode === '2' && 'grid grid-cols-2 gap-4',
        ])}
      >
        {gameMode === '2' && (
          <button
            type="button"
            onClick={handleRetry}
            className="bg-panel-primary hover:bg-panel-primary-hover border-primary rounded-lg border-2 px-4 py-2"
          >
            やり直す
          </button>
        )}
        <button
          type="button"
          onClick={() => setGameMode(null)}
          className="bg-panel-primary hover:bg-panel-primary-hover border-primary rounded-lg border-2 px-4 py-2"
        >
          モード選択へ
        </button>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
}
