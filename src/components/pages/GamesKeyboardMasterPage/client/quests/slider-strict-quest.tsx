'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useId, useRef, useState } from 'react';
import type { NodeQuest, QuestNodeProps } from './types';

const MIN = 0;
const MAX = 100;
const INITIAL = 50;

// Tab/Shift はフォーカス移動のため許可する。それ以外は順序の指定にないキーなので Fail 扱いにする
const PASSTHROUGH_KEYS = new Set(['Tab', 'Shift']);

const SliderStrictQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [value, setValue] = useState(INITIAL);
  // Home → End の正しい順序をたどれているかを追跡する。途中に他のキーを挟んだら即座にリセットして失敗させる
  const stepRef = useRef<'idle' | 'home-pressed'>('idle');

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-lg font-bold">
        音量
      </label>
      <input
        id={id}
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={value}
        className="w-full"
        onKeyDown={(e) => {
          if (PASSTHROUGH_KEYS.has(e.key)) {
            return;
          }

          if (e.key === 'Home') {
            stepRef.current = 'home-pressed';
            return;
          }

          if (e.key === 'End' && stepRef.current === 'home-pressed') {
            onClear();
            return;
          }

          // Home以外から始めた、または Home→End の途中に他キーを挟んだ場合はここに落ちる
          stepRef.current = 'idle';
          onFail();
        }}
        onChange={(e) => {
          setValue(Number(e.currentTarget.value));
        }}
      />
      {/* output の暗黙ロール status による通知が、スライダー自身の値の読み上げと重複するので止める */}
      <output htmlFor={id} aria-live="off" className="text-lg">
        {value}
      </output>
    </div>
  );
};

export const sliderStrictQuest: NodeQuest = {
  type: 'node',
  title: 'スライダーをHome → Endの順に押して最大にしろ',
  hint: 'スライダーにフォーカスを合わせて、Home → Endの順に押す。順番を間違えたり他のキーを押すと失敗になる',
  explanation:
    'スライダーには、Homeで最小値、Endで最大値へ一気に飛べる作りがある。つまみをドラッグしなくても、両端まで動かせる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SliderStrictQuestNode,
};
