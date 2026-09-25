'use client';

import { Switch } from '@/components/ui/forms';
import { NodeQuest, QuestNodeProps } from './types';

const SpaceToggleQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <Switch
      label="通知"
      onChange={(e) => {
        // ネイティブの Space はページスクロールを起こすので止める
        e.preventDefault();
        onClear();
      }}
    />
  );
};

export const spaceToggleQuest: NodeQuest = {
  type: 'node',
  title: 'Space キーでスイッチを ON にしろ',
  hint: 'Enter やなくて Space やで',
  explanation: 'スイッチの ON/OFF は Space キーで切り替える。見た目は似てても、ボタンを押す Enter とは役割が違うんだ。',
  Node: SpaceToggleQuestNode,
};
