'use client';

import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const NUMBER_MIN = 0;
const NUMBER_MAX = 10;
const NUMBER_TARGET = 7;

// 矢印キー操作以外(直接入力・ホイール・貼り付け)は Fail 扱いにする。Tab/Shift はフォーカス移動のため許可する
const ALLOWED_KEYS = ['ArrowUp', 'ArrowDown', 'Tab', 'Shift'];

const NumberSpinnerQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const [value, setValue] = useState(0);

  return (
    <input
      type="number"
      min={NUMBER_MIN}
      max={NUMBER_MAX}
      value={value}
      className="spin-button border-primary px-16PX py-8PX rounded border text-2xl"
      onKeyDown={(e) => {
        if (ALLOWED_KEYS.includes(e.key)) {
          return;
        }

        e.preventDefault();
        onFail();
      }}
      onWheel={(e) => {
        e.preventDefault();
        onFail();
      }}
      onPaste={(e) => {
        e.preventDefault();
        onFail();
      }}
      onChange={(e) => {
        const next = Number(e.currentTarget.value);
        setValue(next);

        if (next === NUMBER_TARGET) {
          onClear();
        }
      }}
    />
  );
};

export const numberSpinnerQuest: NodeQuest = {
  type: 'node',
  title: '矢印キーだけで数値を 7 にしろ',
  hint: '↑↓ キー以外は使うたらあかん。直接入力は Fail や',
  explanation:
    '数値入力欄、実は ↑↓ キーだけで数字を増減できる。直接入力やマウスホイールとはまったく別の操作として扱われているんだ。',
  Node: NumberSpinnerQuestNode,
};
