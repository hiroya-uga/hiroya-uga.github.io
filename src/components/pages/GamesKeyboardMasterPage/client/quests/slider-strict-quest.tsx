'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useId, useRef, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const MIN = 0;
const MAX = 100;
const INITIAL = 50;

// Tab/Shift はフォーカス移動のため許可する。それ以外は順序の指定にないキーなので Fail 扱いにする
const PASSTHROUGH_KEYS = new Set(['Tab', 'Shift']);
const KEY_SEQUENCE = ['Home', 'End'];

const SliderStrictQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [value, setValue] = useState(INITIAL);
  const progressRef = useRef(0);

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

          if (e.key === KEY_SEQUENCE[progressRef.current]) {
            progressRef.current += 1;
            return;
          }

          e.preventDefault();
          onFail();
        }}
        // つまみのドラッグやクリックでも値を動かせてしまうため、キー以外の操作も Fail 扱いにする
        onPointerDown={(e) => {
          e.preventDefault();
          onFail();
        }}
        onChange={(e) => {
          const next = Number(e.currentTarget.value);
          setValue(next);

          if (MAX === next) {
            onClear();
          }
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
    'Homeは最小値、Endは最大値へ一気に飛べるキー。つまみをドラッグしなくても、スライダーの両端まで動かせる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SliderStrictQuestNode,
};
