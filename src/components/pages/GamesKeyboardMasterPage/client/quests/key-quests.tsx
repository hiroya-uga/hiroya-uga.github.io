import { DEFAULT_KEY_QUEST_TIMEOUT } from './config';
import { KeyQuest } from './types';

// 他のクエストと違い専用の Node コンポーネントを持たないため、1ファイル1クエストには分割せず配列でまとめている
export const keyQuests: KeyQuest[] = [
  {
    type: 'key',
    key: 'a',
    title: 'a キーを押せ',
    hint: 'キーボードの a キーを押す',
    explanation: '実は画面のどこにフォーカスがあっても、キーを押せばちゃんと反応する。一番シンプルなキー入力。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>a</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    title: 'Tab キーを押せ',
    hint: 'Tab キーを押す',
    explanation: 'Tab キーはフォーカスを次の要素へ進めるキー。キーボード操作は、ここから始まる。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>Tab(⇥)</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    modifiers: ['shiftKey'],
    title: 'Shift + Tab を押せ',
    hint: 'Shift を押しながら Tab を押す',
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
