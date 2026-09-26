'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const TextareaClearQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
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

export const textareaClearQuest: NodeQuest = {
  type: 'node',
  title: 'テキストエリアの中身をカラにしろ',
  hint: '全部選択してから、DeleteかBackspaceで消す',
  explanation: '全部選択してから消す、テキスト編集の基本操作。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaClearQuestNode,
};
