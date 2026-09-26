'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_TEXT = 'こんにちは世界';
const SELECT_LENGTH = 5;

const TextareaShiftSelectQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    // ドラッグ選択だと Shift+矢印を使わずにクリアできてしまうので、マウス操作は受け付けない
    <div onMouseDown={onFail}>
      <TextField
        label="本文"
        defaultValue={INITIAL_TEXT}
        onFocus={(e) => {
          e.currentTarget.setSelectionRange(0, 0);
        }}
        onSelect={(e) => {
          const { selectionStart, selectionEnd } = e.currentTarget;

          if (selectionStart === 0 && selectionEnd === SELECT_LENGTH) {
            onClear();
          }
        }}
      />
    </div>
  );
};

export const textareaShiftSelectQuest: NodeQuest = {
  type: 'node',
  title: 'テキストエリアの「こんにちは」だけを、Shift+→で選択しろ',
  hint: 'テキストエリアにフォーカスを合わせて、Shiftを押しながら→を5回押す。マウスでの選択は失敗になる',
  explanation:
    'Shiftを押しながら矢印キーを押すと、カーソルを動かした分だけ文字を選択できる。Shift+→で右へ、Shift+←で左へ広げられるから、ドラッグしなくても好きな範囲を選べる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaShiftSelectQuestNode,
};
