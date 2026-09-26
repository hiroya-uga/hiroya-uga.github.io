'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const MIN_LENGTH = 4;

const EnterSubmitQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState('');

  return (
    <form
      className="grid w-80 max-w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity()) {
          onClear();
        }
      }}
    >
      <TextField
        label="ニックネーム"
        description={`${MIN_LENGTH}文字以上で入力してください`}
        autoComplete="off"
        value={value}
        onInput={(e) => {
          setValue(e.currentTarget.value);
        }}
        pattern={`.{${MIN_LENGTH},}`}
        title={`${MIN_LENGTH}文字以上で入力`}
        required
      />

      <button type="submit" className="border-primary px-16PX py-8PX mx-auto block rounded border">
        送信
      </button>
    </form>
  );
};

export const enterSubmitQuest: NodeQuest = {
  type: 'node',
  title: `ニックネームを${MIN_LENGTH}文字以上で入力して、Enterで送信しろ`,
  hint: `入力欄に${MIN_LENGTH}文字以上入力して、そのままEnterを押す。文字数が足りないとエラーが出る`,
  explanation:
    'フォームには、入力欄でEnterを押すと送信できる作りが一般的。送信ボタンまでTabで移動しなくてよい。入力内容に誤りがあれば、送信を止めてエラーを表示する実装が多い。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: EnterSubmitQuestNode,
};
