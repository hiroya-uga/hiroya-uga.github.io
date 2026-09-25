'use client';

import { Switch } from '@/components/ui/forms';
import { NodeQuest, QuestNodeProps } from './types';

const SpaceToggleQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <Switch
      label="通知"
      onChange={() => {
        onClear();
      }}
    />
  );
};

export const spaceToggleQuest: NodeQuest = {
  type: 'node',
  title: 'Space キーでスイッチを ON にしろ',
  hint: 'Enter ではなく Space で切り替える',
  explanation: 'スイッチの ON/OFF は Space キーで切り替えるのが基本。Enter で開くリンクとは、使うキーが違う。',
  Node: SpaceToggleQuestNode,
};
