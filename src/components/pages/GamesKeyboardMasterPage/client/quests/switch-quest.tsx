'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
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
  title: 'Space キーでスイッチを ON にしろ',
  hint: 'Enter ではなく Space で切り替える',
  explanation: 'スイッチの ON/OFF は Space キーで切り替えるのが基本。Enter で開くリンクとは、使うキーが違う。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SwitchQuestNode,
};
