'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { SelectField } from '@/components/ui/forms/SelectField';
import { NodeQuest, QuestNodeProps } from './types';

const SELECT_OPTIONS = ['りんご', 'みかん', 'ぶどう', 'なし'];
const SELECT_ANSWER = SELECT_OPTIONS[2];

const SelectQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    <SelectField
      label="好きな果物"
      defaultValue=""
      onChange={(e) => {
        if (e.currentTarget.value === SELECT_ANSWER) {
          onClear();
          return;
        }

        onFail();
      }}
    >
      <option value="" disabled>
        選択してください
      </option>
      {SELECT_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </SelectField>
  );
};

export const selectQuest: NodeQuest = {
  type: 'node',
  title: '「3つ目」の選択肢を選べ',
  hint: 'プルダウンを開いて「ぶどう」を選ぶ',
  explanation: 'プルダウン、実はマウスがなくても開いて選択肢を選べる。',
  Node: SelectQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
