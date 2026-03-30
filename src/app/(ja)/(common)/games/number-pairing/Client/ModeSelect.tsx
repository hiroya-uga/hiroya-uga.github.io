import type { GameMode } from './logics';

interface Props {
  onSelect: (mode: GameMode) => void;
}

export function ModeSelect({ onSelect }: Props) {
  return (
    <>
      <p className="mb-6 text-center text-lg font-bold">難易度を選んでください</p>
      <p className="@w400:grid-cols-2 mx-auto grid w-fit gap-4">
        <button
          type="button"
          onClick={() => onSelect('1')}
          className="bg-panel-primary hover:bg-panel-primary-hover border-primary grow rounded-lg border-2 px-6 py-4"
        >
          <span className="block text-xl font-bold">イージー</span>
          <span className="text-low-contrast mt-1 block text-sm">数字のペアを見つけて10を作ろう！</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect('2')}
          className="bg-panel-primary hover:bg-panel-primary-hover border-primary grow rounded-lg border-2 px-6 py-4"
        >
          <span className="block text-xl font-bold">ハード</span>
          <span className="text-low-contrast mt-1 block text-sm">合計が10になるように数字を合体させよう！</span>
        </button>
      </p>
    </>
  );
}
