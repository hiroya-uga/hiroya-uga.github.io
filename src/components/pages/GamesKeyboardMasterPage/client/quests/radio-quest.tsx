'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { Radio } from '@/components/ui/forms/Radio';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const RadioQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [checked, setChecked] = useState(false);

  return (
    <Radio
      label="選択する"
      name="keyboard-master-radio-quest"
      checked={checked}
      onChange={(e) => {
        if (e.currentTarget.checked) {
          setChecked(true);
          onClear();
        }
      }}
    />
  );
};

export const radioQuest: NodeQuest = {
  type: 'node',
  title: 'ラジオボタンを選択しろ',
  hint: 'ラジオボタンにフォーカスを合わせて、Spaceで選択する',
  explanation:
    'ラジオボタンもSpaceキーで選択できる。ただしチェックボックスと違って、選択済みのものをSpaceでもう一度押しても解除はされない。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioQuestNode,
};
