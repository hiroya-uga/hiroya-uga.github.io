'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const BLOCKED_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

const TextareaStrictClearQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState(LOREM_IPSUM);

  return (
    <TextField
      label="本文"
      multiline
      value={value}
      onKeyDown={(e) => {
        // Shift や Cmd を組み合わせた選択範囲の拡張も key は Arrow のままなので、まとめて止まる
        if (BLOCKED_KEYS.has(e.key)) {
          e.preventDefault();
          onFail();
        }
      }}
      onInput={(e) => {
        const next = e.currentTarget.value;
        setValue(next);

        if (next === '') {
          onClear();
        }
      }}
    />
  );
};

export const textareaStrictClearQuest: NodeQuest = {
  type: 'node',
  title: '矢印キーを使わずに、テキストエリアの中身をカラにしろ',
  hint: 'Ctrl+A（MacはCmd+A）で全部選択して、DeleteかBackspaceで消す。矢印キーを押すと失敗になる',
  explanation:
    '全選択のショートカットを覚えておけば、矢印キーでカーソルを動かさなくても一気に選択できる。Shift+Home / Shift+Endのような選択の仕方もある。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaStrictClearQuestNode,
};
