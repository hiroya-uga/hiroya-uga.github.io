'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { Switch } from '@/components/ui/forms';
import { NodeQuest, QuestNodeProps } from './types';

const SwitchQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <Switch
      label="通知"
      onChange={() => {
        onClear();
      }}
    />
  );
};

export const switchQuest: NodeQuest = {
  type: 'node',
  title: 'SpaceキーでスイッチをONにしろ',
  hint: 'EnterではなくSpaceで切り替える',
  explanation:
    'スイッチのON/OFFは、Spaceキーで切り替える作りが一般的。Enterで開くリンクとは、使うキーが違う場合が多い。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SwitchQuestNode,
};
