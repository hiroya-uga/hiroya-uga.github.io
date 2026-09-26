import { ReactNode } from 'react';

export interface QuestNodeProps {
  onClear: () => void;
  onFail: () => void;
}

export const MODIFIER_KEYS = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey'] as const;
export type ModifierKey = (typeof MODIFIER_KEYS)[number];

export const MODIFIER_LABELS: Record<ModifierKey, string> = {
  shiftKey: 'Shift',
  ctrlKey: 'Ctrl',
  altKey: 'Alt',
  metaKey: 'Cmd',
};

export interface QuestBase {
  title: string;
  // プレイ中に一定時間が経ったら表示するヒント
  hint: string;
  // リザルト画面での解説表示用
  explanation: string;
  // 指定した場合、エンジン側でカウントダウン表示とタイムアップ Fail を管理する(ミリ秒)
  timeLimit?: number;
}

export interface KeyQuest extends QuestBase {
  type: 'key';
  // 配列のときは全キーが押されるまで待つ。順不同・同時押し不要で、無関係なキーを押しても Fail にしない
  key: string | string[];
  modifiers?: ModifierKey[];
  // key を配列で指定したお題のみ、押し終えたキーを受け取って表示に反映できる
  Node: (props: Readonly<{ pressedKeys: ReadonlySet<string> }>) => ReactNode;
}

export interface NodeQuest extends QuestBase {
  type: 'node';
  // フックを使う実装もあるので、独立したコンポーネントとして持たせて JSX として描画する
  Node: (props: Readonly<QuestNodeProps>) => ReactNode;
}

export type Quest = KeyQuest | NodeQuest;

// お題文と Node が同じ乱数を共有する必要があるクエストは、開始のたびに生成し直せるよう関数で持たせる
export type QuestFactory = () => Quest;
export type QuestSource = Quest | QuestFactory;

export const resolveQuests = (sources: QuestSource[]): Quest[] =>
  sources.map((source) => (typeof source === 'function' ? source() : source));
