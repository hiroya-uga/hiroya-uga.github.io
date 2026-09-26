'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { useRef } from 'react';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const SOURCE_TEXT = '切り取って貼り付けられる';

const TextareaCutAndPasteQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const sourceRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const destinationRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  // 再描画は要らないので state にはしない
  const isPastedRef = useRef(false);

  // 貼り付けと切り取りのどちらが先でも成立するので、どちらの入力でも同じ条件で判定する
  const judge = () => {
    if (sourceRef.current?.value === '' && destinationRef.current?.value === SOURCE_TEXT && isPastedRef.current) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextField label="切り取り元" defaultValue={SOURCE_TEXT} ref={sourceRef} onInput={judge} />
      <TextField
        label="貼り付け先"
        defaultValue=""
        ref={destinationRef}
        onInput={(e) => {
          // 同じ文字列を打ち直しても貼り付けたことにはならないので、貼り付け由来の入力かどうかを控えておく
          isPastedRef.current = e.nativeEvent.inputType === 'insertFromPaste';
          judge();
        }}
      />
    </div>
  );
};

export const textareaCutAndPasteQuest: NodeQuest = {
  type: 'node',
  title: '1つ目の文章を切り取って、2つ目のテキストエリアに貼り付けろ',
  hint: 'Ctrl+A → Ctrl+X（MacはCmd+A → Cmd+X）で切り取り、次の欄にフォーカスを合わせて、Ctrl+V（MacはCmd+V）で貼り付ける',
  explanation:
    'Ctrl+X（MacはCmd+X）は、コピーと違って元の文章を消しながらクリップボードに入れる。文章を別の場所へ移したいときは、切り取って貼り付けると一手で済む。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TextareaCutAndPasteQuestNode,
};
