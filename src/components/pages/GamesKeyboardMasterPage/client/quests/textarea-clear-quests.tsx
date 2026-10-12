'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { TextField } from '@/components/ui/forms/TextField';
import { useState } from 'react';
import type { NodeQuest, QuestNodeProps } from './types';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const BLOCKED_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

const createClearQuest = ({
  strict,
  title,
  hint,
  explanation,
}: {
  strict: boolean;
  title: string;
  hint: string;
  explanation: string;
}): NodeQuest => {
  const ClearQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
    const [value, setValue] = useState(LOREM_IPSUM);

    return (
      <TextField
        label="本文"
        multiline
        value={value}
        onKeyDown={
          strict
            ? (e) => {
                // Shift や Cmd を組み合わせた選択範囲の拡張も key は Arrow のままなので、まとめて止まる
                if (BLOCKED_KEYS.has(e.key)) {
                  e.preventDefault();
                  onFail();
                }
              }
            : undefined
        }
        onInput={(e) => {
          const next = e.currentTarget.value;
          setValue(next);

          if (next === '') {
            onClear();
          }
        }}
      />
    );
  };

  return {
    type: 'node',
    title,
    hint,
    explanation,
    timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
    Node: ClearQuestNode,
  };
};

export const textareaClearQuest = createClearQuest({
  strict: false,
  title: 'テキストエリアの中身をカラにしろ',
  hint: '全部選択してから、DeleteかBackspaceで消す',
  explanation: '全選択してから消すのは、テキスト編集の基本操作の1つ。',
});

export const textareaStrictClearQuest = createClearQuest({
  strict: true,
  title: '矢印キーを使わずに、テキストエリアの中身をカラにしろ',
  hint: 'Ctrl+A（MacはCmd+A）で全部選択して、DeleteかBackspaceで消す。矢印キーを押すと失敗になる',
  explanation:
    '全選択のショートカットを覚えておけば、矢印キーでカーソルを動かさなくても一気に選択できる。Shift+Home / Shift+Endのような選択の仕方もある。',
});
