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
  key: string;
  modifiers?: ModifierKey[];
  Node: () => ReactNode;
}

export interface NodeQuest extends QuestBase {
  type: 'node';
  // フックを使う実装もあるので、独立したコンポーネントとして持たせて JSX として描画する
  Node: (props: Readonly<QuestNodeProps>) => ReactNode;
}

export type Quest = KeyQuest | NodeQuest;
