'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const MIN = 0;
const MAX = 100;
const INITIAL = 50;

const SliderMaxQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [value, setValue] = useState(INITIAL);

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

export const sliderMaxQuest: NodeQuest = {
  type: 'node',
  title: 'スライダーを最大にしろ',
  hint: 'スライダーにフォーカスを合わせて、Endキーを押す',
  explanation:
    'スライダーには、←→で1つずつ、PageUp / PageDownで大きく動かせる作りがある。Homeで最小値、Endで最大値へ一気に飛べるものも多く、つまみをドラッグしなくても操作できる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SliderMaxQuestNode,
};
