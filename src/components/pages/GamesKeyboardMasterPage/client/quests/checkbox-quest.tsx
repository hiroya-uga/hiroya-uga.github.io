'use client';

import { Checkbox } from '@/components/ui/forms/Checkbox';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const CheckboxQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <Checkbox
      label="利用規約に同意する"
      onChange={(e) => {
        if (e.currentTarget.checked) {
          onClear();
        }
      }}
    />
  );
};

export const checkboxQuest: NodeQuest = {
  type: 'node',
  title: 'チェックボックスを切り替えろ',
  hint: '10秒以内に Tab でフォーカスして Space でチェックを入れるんや',
  explanation: 'チェックボックスの ON/OFF は Space キーひとつで切り替えられる。Enter キーじゃないのがポイント。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: CheckboxQuestNode,
};
