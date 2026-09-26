'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_TEXT = 'Delete';

const TextareaDelQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    <TextField
      label="本文"
      multiline
      defaultValue={INITIAL_TEXT}
      onFocus={(e) => {
        e.currentTarget.setSelectionRange(0, 0);
      }}
      // マウスクリックや矢印キー、全選択でキャレットを動かせると Backspace など別の手段で消せてしまうため、常に先頭へ戻す
      onSelect={(e) => {
        const { selectionStart, selectionEnd } = e.currentTarget;

        if (0 !== selectionStart || 0 !== selectionEnd) {
          onFail();
        }
      }}
      onInput={(e) => {
        // Delete キー(と Mac の Ctrl+D)は deleteContentForward になる
        if (e.nativeEvent.inputType === 'deleteContentForward' && e.currentTarget.value === 'ete') {
          onClear();
        }
      }}
    />
  );
};

export const textareaDelQuest: NodeQuest = {
  type: 'node',
  title: 'カーソルが先頭に固定されたテキストエリアの文字を、Deleteキーで全部消せ',
  hint: 'テキストエリアにフォーカスを合わせて、Deleteキーを押し続ける。カーソルは先頭から動かせない。Macはfn+Delete（Ctrl+Dでも消せる）',
  explanation:
    'Deleteキーはカーソルの右側の文字、Backspaceキーは左側の文字を消す。MacのキーボードはDeleteキーがBackspace相当なので、右側を消すにはfn+DeleteかCtrl+Dを使う。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaDelQuestNode,
};
