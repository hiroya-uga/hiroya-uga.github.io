'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const NUMBER_TARGET = 7;

// 矢印キー操作以外(直接入力・ホイール・貼り付け)は Fail 扱いにする。Tab/Shift はフォーカス移動のため許可する
const ALLOWED_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Tab', 'Shift']);

const NumberSpinnerQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [value, setValue] = useState(0);

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-lg font-bold">
        数値
      </label>
      <input
        id={id}
        type="number"
        value={value}
        className="spin-button border-primary px-16PX py-8PX rounded border text-2xl"
        onKeyDown={(e) => {
          if (ALLOWED_KEYS.has(e.key)) {
            return;
          }

          e.preventDefault();
          onFail();
        }}
        onWheel={(e) => {
          e.preventDefault();
          onFail();
        }}
        onPaste={(e) => {
          e.preventDefault();
          onFail();
        }}
        onChange={(e) => {
          const next = Number(e.currentTarget.value);
          setValue(next);

          if (next === NUMBER_TARGET) {
            onClear();
          }
        }}
      />
    </div>
  );
};

export const numberSpinnerQuest: NodeQuest = {
  type: 'node',
  title: '矢印キーだけで数値を7にしろ',
  hint: '↑↓キーだけで数値を変える。直接入力すると失敗になる',
  explanation:
    '数値入力欄、実は↑↓キーだけで数字を増減できる。直接入力やマウスホイールとはまったく別の操作として扱われている。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: NumberSpinnerQuestNode,
};
