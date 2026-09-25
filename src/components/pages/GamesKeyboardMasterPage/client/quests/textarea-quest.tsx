'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { useState } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const TextareaQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState(LOREM_IPSUM);

  return (
    <TextField
      label="本文"
      multiline
      value={value}
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

export const textareaQuest: NodeQuest = {
  type: 'node',
  title: 'テキストエリアの中身をカラにしろ',
  hint: '10秒以内に全部選択してから Delete や Backspace で消すんや',
  explanation: '全部選択してから消す、テキスト編集の基本操作。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaQuestNode,
};
