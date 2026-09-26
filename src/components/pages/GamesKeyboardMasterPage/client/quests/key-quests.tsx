import { DEFAULT_KEY_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import clsx from 'clsx';
import { KeyQuest } from './types';

const ARROW_KEYS = [
  { key: 'ArrowUp', label: '↑' },
  { key: 'ArrowDown', label: '↓' },
  { key: 'ArrowLeft', label: '←' },
  { key: 'ArrowRight', label: '→' },
];

const DELETE_KEYS = [
  { key: 'Backspace', label: 'Backspace(⌫)' },
  { key: 'Delete', label: 'Delete(⌦)' },
];

const NAVIGATION_KEYS = [
  { key: 'Home', label: 'Home' },
  { key: 'End', label: 'End' },
  { key: 'PageUp', label: 'PageUp' },
  { key: 'PageDown', label: 'PageDown' },
];

// 全キーを押すお題で、押し終えたキーを薄く表示する
const PressedKeyList = ({
  keys,
  pressedKeys,
}: Readonly<{ keys: { key: string; label: string }[]; pressedKeys: ReadonlySet<string> }>) => (
  <span className="flex gap-2">
    {keys.map(({ key, label }) => (
      <kbd key={key} className={clsx(pressedKeys.has(key) && 'opacity-50')}>
        {label}
      </kbd>
    ))}
  </span>
);

// 他のクエストと違い専用の Node コンポーネントを持たないため、1ファイル1クエストには分割せず配列でまとめている
export const keyQuests: KeyQuest[] = [
  {
    type: 'key',
    key: ' ',
    title: 'Spaceキーを押せ',
    hint: 'キーボードのSpaceキーを押す',
    explanation: '画面のどこにフォーカスがあっても、キー入力を受け取れる作りがある。一番シンプルなキー入力。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>Space</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    title: 'Tabキーを押せ',
    hint: 'Tabキーを押す',
    explanation: 'Tabキーは、フォーカスを次の要素へ進めるキーとして使われる。キーボード操作は、ここから始まる。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => <kbd>Tab(⇥)</kbd>,
  },
  {
    type: 'key',
    key: 'Tab',
    modifiers: ['shiftKey'],
    title: 'Shift + Tabを押せ',
    hint: 'Shiftを押しながらTabを押す',
    explanation: 'Shiftを押しながらTabを押すと、いつもとは逆方向にフォーカスが移動する、という使い方が一般的。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: () => (
      <kbd>
        <kbd>Shift(⇧)</kbd>
        <span> + </span>
        <kbd>Tab(⇥)</kbd>
      </kbd>
    ),
  },
  {
    type: 'key',
    key: ARROW_KEYS.map(({ key }) => key),
    title: '矢印キーを4つとも押せ',
    hint: '↑ ↓ ← → を1回ずつ押す。',
    explanation:
      '矢印キーは、スクロールやカーソル移動、スライダーの操作など、あちこちで使われる。上下左右の4つがそろって、ようやく一通りの移動ができる。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: ({ pressedKeys }) => <PressedKeyList keys={ARROW_KEYS} pressedKeys={pressedKeys} />,
  },
  {
    type: 'key',
    key: NAVIGATION_KEYS.map(({ key }) => key),
    title: 'Home・End・PageUp・PageDownを押せ',
    hint: 'ノートパソコンでは、fnキーを押しながら、Homeは←、Endは→、PageUpは↑、PageDownは↓を押すことが多い。テンキーがあるなら、NumLockをOFFにして、Homeは7、Endは1、PageUpは9、PageDownは3を押す。',
    explanation:
      'Home・Endは行頭・行末やページの先頭・末尾へ、PageUp・PageDownは1画面分だけ上下へ移動するキー。ノートパソコンにはこれらの専用キーがないことがあり、fnキーを押しながら矢印キーを押して代用する。テンキーも、NumLockがOFFのときはこれらのキーとして働く。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: ({ pressedKeys }) => <PressedKeyList keys={NAVIGATION_KEYS} pressedKeys={pressedKeys} />,
  },
  {
    type: 'key',
    key: DELETE_KEYS.map(({ key }) => key),
    title: 'BackspaceキーとDeleteキーを押せ',
    hint: 'Backspaceキーは、Macでは「delete」と書かれていることもある。Deleteキーは、ノートパソコンではfnキーを押しながらBackspaceキーを押すことが多い。テンキーがあるなら、NumLockをOFFにして「.」を押す。',
    explanation:
      'Backspaceはカーソルの左側、Deleteは右側の文字を消すキー。ノートパソコンにはDeleteキーがないことがあり、fnキーを押しながらBackspaceキーを押して代用する。テンキーの「.」も、NumLockがOFFのときはDeleteとして働く。Macでは、Backspaceキーに「delete」と書かれている。',
    timeLimit: DEFAULT_KEY_QUEST_TIMEOUT,
    Node: ({ pressedKeys }) => <PressedKeyList keys={DELETE_KEYS} pressedKeys={pressedKeys} />,
  },
];
