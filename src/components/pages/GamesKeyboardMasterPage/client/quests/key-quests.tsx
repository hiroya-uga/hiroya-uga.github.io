import { DEFAULT_KEY_QUEST_TIMEOUT } from './config';
import { KeyQuest } from './types';

// 他のクエストと違い専用の Node コンポーネントを持たないため、1ファイル1クエストには分割せず配列でまとめている
export const keyQuests: KeyQuest[] = [
  {
    type: 'key',
    key: 'a',
    title: 'a キーを押せ',
    hint: '5秒以内にキーボードの a キーをそのまま押すだけや',
    explanation: '実は画面のどこにフォーカスがあっても、キーを押せばちゃんと反応する。一番シンプルなキー入力。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>a</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    title: 'tabキーを押せ',
    hint: '5秒以内に tab キーを押すだけや',
    explanation: 'さっきと同じく、基本のキー入力の練習。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>Tab(⇥)</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    modifiers: ['shiftKey'],
    title: 'Shift + Tab を押せ',
    hint: '5秒以内に Shift を押しながら Tab を押すんや',
    explanation: 'Shift を押しながら Tab を押すと、いつもとは逆方向にフォーカスが移動する。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => (
      <kbd>
        <kbd>Shift(⇧)</kbd>
        <span> + </span>
        <kbd>Tab(⇥)</kbd>
      </kbd>
    ),
  },
];
