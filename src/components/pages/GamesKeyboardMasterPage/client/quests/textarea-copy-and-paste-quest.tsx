'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const SOURCE_TEXT = 'コピーして貼り付けられる';

const TextareaCopyAndPasteQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <div className="flex flex-col gap-4">
      <TextField label="コピー元" multiline readOnly defaultValue={SOURCE_TEXT} />
      <TextField
        label="貼り付け先"
        multiline
        defaultValue=""
        onInput={(e) => {
          // 同じ文字列を打ち直しても貼り付けたことにはならないので、貼り付け由来の入力だけを見る
          if (e.nativeEvent.inputType === 'insertFromPaste' && e.currentTarget.value === SOURCE_TEXT) {
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
  hint: 'Ctrl+A → Ctrl+C（Mac は Cmd+A → Cmd+C）でコピーして、Tab で次の欄へ移動し、Ctrl+V（Mac は Cmd+V）で貼り付ける',
  explanation:
    'Ctrl+C（Mac は Cmd+C）でコピー、Ctrl+V（Mac は Cmd+V）で貼り付け。Tab で欄を移動すれば、マウスなしで文章を写せる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TextareaCopyAndPasteQuestNode,
};
