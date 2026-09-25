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
  },
  {
    type: 'key',
    key: 'b',
    title: 'b キーを押せ',
    hint: '5秒以内に b キーを押すだけや',
    explanation: 'さっきと同じく、基本のキー入力の練習。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
  },
  {
    type: 'key',
    key: '3',
    title: '3 キーを押せ',
    hint: '5秒以内に数字の 3 キーを押すだけや',
    explanation: '数字キーもアルファベットキーとまったく同じ扱い。押すだけで反応する。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
  },
  {
    type: 'key',
    key: 'Tab',
    modifiers: ['shiftKey'],
    title: 'Shift + Tab を押せ',
    hint: '5秒以内に Shift を押しながら Tab を押すんや',
    explanation: 'Shift を押しながら Tab を押すと、いつもとは逆方向にフォーカスが移動する。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
  },
];
