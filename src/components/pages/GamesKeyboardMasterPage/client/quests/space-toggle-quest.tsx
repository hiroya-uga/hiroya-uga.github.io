'use client';

import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const SpaceToggleQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      className="border-primary px-16PX py-8PX select-none rounded border text-2xl"
      onKeyDown={(e) => {
        if (e.key === ' ') {
          // ネイティブの Space はページスクロールを起こすので止める
          e.preventDefault();
          setChecked(true);
          onClear();
          return;
        }

        if (e.key === 'Enter') {
          // Enter でも切り替わってしまうと Space 固有の操作か判別できなくなる
          onFail();
        }
      }}
    >
      {checked ? 'ON' : 'OFF'}
    </div>
  );
};

export const spaceToggleQuest: NodeQuest = {
  type: 'node',
  title: 'Space キーでスイッチを ON にしろ',
  hint: 'Enter やなくて Space やで',
  explanation: 'スイッチの ON/OFF は Space キーで切り替える。見た目は似てても、ボタンを押す Enter とは役割が違うんだ。',
  Node: SpaceToggleQuestNode,
};
