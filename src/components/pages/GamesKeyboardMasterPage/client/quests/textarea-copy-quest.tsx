'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { useEffect, useRef } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const COPY_TEXT = 'この文章をコピーしろ';

const TextareaCopyQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (el === null) {
      return;
    }

    // 何も選択していない状態の Ctrl+C でも copy イベントは発火するので、全選択されているときだけクリアにする
    const handleCopy = () => {
      if (el.selectionStart === 0 && el.selectionEnd === el.value.length) {
        onClear();
      }
    };

    el.addEventListener('copy', handleCopy);

    return () => {
      el.removeEventListener('copy', handleCopy);
    };
  }, [onClear]);

  return <TextField label="本文" multiline readOnly defaultValue={COPY_TEXT} ref={ref} />;
};

export const textareaCopyQuest: NodeQuest = {
  type: 'node',
  title: 'テキストエリアの中身を全部選択してコピーしろ',
  hint: 'Ctrl+A → Ctrl+C（MacはCmd+A → Cmd+C）で全部選択してコピーする',
  explanation:
    '全選択とコピーはセットで覚えたい操作。Ctrl+C（MacはCmd+C）でコピー、Ctrl+V（MacはCmd+V）で貼り付けられるから、マウスなしで文章を写せる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaCopyQuestNode,
};
