'use client';

import { Radio } from '@/components/ui/forms/Radio';
import { useState } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const RadioQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState<'a' | 'b'>('a');

  return (
    <div className="flex gap-4">
      <Radio label="A" name="keyboard-master-radio-quest" checked={value === 'a'} onChange={() => setValue('a')} />
      <Radio
        label="B"
        name="keyboard-master-radio-quest"
        checked={value === 'b'}
        onChange={() => {
          setValue('b');
          onClear();
        }}
      />
    </div>
  );
};

export const radioQuest: NodeQuest = {
  type: 'node',
  title: 'ラジオボタンを「B」に切り替えろ',
  hint: '10秒以内に矢印キーか Space で切り替えるんや',
  explanation: 'ラジオボタンは同じグループの中なら、クリックしなくても矢印キーだけで選択を移動できる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioQuestNode,
};
