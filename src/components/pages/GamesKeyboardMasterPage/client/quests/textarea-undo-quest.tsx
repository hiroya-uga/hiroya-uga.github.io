'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_TEXT = '消しても戻せる';

const TextareaUndoQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  // 制御コンポーネントにするとブラウザ標準の undo 履歴を壊しかねないので、defaultValue のまま DOM に任せる
  return (
    <TextField
      label="本文"
      multiline
      defaultValue={INITIAL_TEXT}
      onInput={(e) => {
        // 打ち直しで同じ文字列にしても戻したことにはならないので、undo 由来の入力だけを見る
        if (e.nativeEvent.inputType === 'historyUndo' && e.currentTarget.value === INITIAL_TEXT) {
          onClear();
        }
      }}
    />
  );
};

export const textareaUndoQuest: NodeQuest = {
  type: 'node',
  title: 'テキストを全部消してから、元に戻せ',
  hint: 'Ctrl+A → Deleteで全部消して、Ctrl+Z（MacはCmd+Z）で元に戻す',
  explanation: '一般的に、Ctrl+Z（MacはCmd+Z）で直前の操作を取り消せる。消しすぎても慌てなくていい。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TextareaUndoQuestNode,
};
