'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { isInputTypeWithValue } from '@/components/pages/GamesKeyboardMasterPage/utils';
import { TextField } from '@/components/ui/forms/TextField';
import type { NodeQuest, QuestNodeProps } from './types';

const SOURCE_TEXT = 'コピーして貼り付けられる';

const TextareaCopyAndPasteQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <div className="flex flex-col gap-4">
      <TextField label="コピー元" readOnly defaultValue={SOURCE_TEXT} />
      <TextField
        label="貼り付け先"
        defaultValue=""
        onInput={(e) => {
          if (
            isInputTypeWithValue({ inputEvent: e, expectedInputType: 'insertFromPaste', expectedValue: SOURCE_TEXT })
          ) {
            onClear();
          }
        }}
      />
    </div>
  );
};

export const textareaCopyAndPasteQuest: NodeQuest = {
  type: 'node',
  title: '1つ目の文章を、2つ目のテキストエリアに貼り付けろ',
  hint: 'Ctrl+A → Ctrl+C（MacはCmd+A → Cmd+C）でコピーして、次の欄にフォーカスを合わせ、Ctrl+V（MacはCmd+V）で貼り付ける',
  explanation:
    '一般的に、Ctrl+C（MacはCmd+C）でコピー、Ctrl+V（MacはCmd+V）で貼り付けられる。Tabで欄を移動すれば、マウスなしで文章を写せる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TextareaCopyAndPasteQuestNode,
};
