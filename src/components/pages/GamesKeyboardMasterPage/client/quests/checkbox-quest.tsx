'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { Checkbox } from '@/components/ui/forms/Checkbox';
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
  hint: 'チェックボックスにフォーカスを合わせて、Spaceでチェックを入れる',
  explanation: 'チェックボックスのON/OFFはSpaceキーひとつで切り替えられる。Enterキーじゃないのがポイント。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: CheckboxQuestNode,
};
