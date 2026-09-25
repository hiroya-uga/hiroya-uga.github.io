'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_TEXT = '戻したものをやり直せる';

const TextareaRedoQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  // 制御コンポーネントにするとブラウザ標準の undo / redo 履歴を壊しかねないので、defaultValue のまま DOM に任せる
  return (
    <TextField
      label="本文"
      multiline
      defaultValue={INITIAL_TEXT}
      onInput={(e) => {
        // 手で消し直しても redo したことにはならないので、redo 由来の入力だけを見る
        if (e.nativeEvent.inputType === 'historyRedo' && e.currentTarget.value === '') {
          onClear();
        }
      }}
    />
  );
};

export const textareaRedoQuest: NodeQuest = {
  type: 'node',
  title: 'テキストを全部消して元に戻してから、やり直せ',
  hint: 'Ctrl+A → Delete で全部消して、Ctrl+Z で戻し、Ctrl+Y（Mac は Cmd+Shift+Z）でやり直す',
  explanation: 'Ctrl+Y（Mac は Cmd+Shift+Z）で、取り消した操作をやり直せる。Ctrl+Z で戻りすぎたときの保険になる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TextareaRedoQuestNode,
};
