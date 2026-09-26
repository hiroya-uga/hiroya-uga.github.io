import { DEFAULT_KEY_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { KeyQuest } from './types';

// 他のクエストと違い専用の Node コンポーネントを持たないため、1ファイル1クエストには分割せず配列でまとめている
export const keyQuests: KeyQuest[] = [
  {
    type: 'key',
    key: 'a',
    title: 'aキーを押せ',
    hint: 'キーボードのaキーを押す',
    explanation: '実は画面のどこにフォーカスがあっても、キーを押せばちゃんと反応する。一番シンプルなキー入力。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>a</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    title: 'Tabキーを押せ',
    hint: 'Tabキーを押す',
    explanation: 'Tabキーはフォーカスを次の要素へ進めるキー。キーボード操作は、ここから始まる。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>Tab(⇥)</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    modifiers: ['shiftKey'],
    title: 'Shift + Tabを押せ',
    hint: 'Shiftを押しながらTabを押す',
    explanation: 'Shiftを押しながらTabを押すと、いつもとは逆方向にフォーカスが移動する。',
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
