'use client';

import { Radio } from '@/components/ui/forms/Radio';
import { useState } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const RadioChangeQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState<'a' | 'b'>('a');

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold leading-snug">選択肢</legend>
      <div className="flex gap-4">
        <Radio
          label="A"
          name="keyboard-master-radio-change-quest"
          checked={value === 'a'}
          onChange={() => setValue('a')}
        />
        <Radio
          label="B"
          name="keyboard-master-radio-change-quest"
          checked={value === 'b'}
          onChange={() => {
            setValue('b');
            onClear();
          }}
        />
      </div>
    </fieldset>
  );
};

export const radioChangeQuest: NodeQuest = {
  type: 'node',
  title: 'ラジオボタンを「B」に切り替えろ',
  hint: '10秒以内に矢印キーか Space で切り替えるんや',
  explanation: 'ラジオボタンは同じグループの中なら、クリックしなくても矢印キーだけで選択を移動できる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioChangeQuestNode,
};
