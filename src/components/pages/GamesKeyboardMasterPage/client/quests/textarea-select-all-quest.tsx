'use client';

import { TextField } from '@/components/ui/forms/TextField';
import { useEffect, useRef } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const SELECT_ALL_TEXT = 'この文章をぜんぶ選択しろ';

const TextareaSelectAllQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    // Ctrl+A / Cmd+A の全選択は input イベントを発火しないので selectionchange 相当の select イベントで検知する
    const handleSelect = () => {
      if (el.selectionStart === 0 && el.selectionEnd === el.value.length && el.value.length > 0) {
        onClear();
      }
    };

    el.addEventListener('select', handleSelect);

    return () => {
      el.removeEventListener('select', handleSelect);
    };
  }, [onClear]);

  return <TextField label="本文" multiline readOnly defaultValue={SELECT_ALL_TEXT} ref={ref} />;
};

export const textareaSelectAllQuest: NodeQuest = {
  type: 'node',
  title: 'テキストエリアの中身を全部選択しろ',
  hint: 'Ctrl+A（MacはCmd+A）で全選択する',
  explanation: 'Ctrl+A（MacはCmd+A）を使えば、ドラッグなしで一瞬で全選択できる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TextareaSelectAllQuestNode,
};
