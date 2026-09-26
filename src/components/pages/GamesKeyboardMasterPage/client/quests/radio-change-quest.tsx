'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { Radio } from '@/components/ui/forms/Radio';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const RadioChangeQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState<'a' | 'b'>('a');

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold leading-snug">選択肢</legend>
      <div className="gap-16PX flex flex-wrap">
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
  hint: '矢印キーかSpaceで切り替える',
  explanation: 'ラジオボタンは、同じグループの中ならクリックしなくても、矢印キーで選択を移動できる作りが一般的。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioChangeQuestNode,
};
