'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
import { NodeQuest, QuestNodeProps } from './types';

const TAB_OPTIONS = ['A', 'B', 'C', 'D'];
const TAB_ANSWER = 'C';

const TabNavigationQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    <div className="flex gap-4">
      {TAB_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="border-primary px-16PX py-8PX rounded border text-2xl"
          onClick={(e) => {
            // detail === 0 はキーボード操作(Enter/Space)経由のクリックのみを通す
            if (e.detail !== 0) {
              return;
            }

            if (option === TAB_ANSWER) {
              onClear();
              return;
            }

            onFail();
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export const tabNavigationQuest: NodeQuest = {
  type: 'node',
  title: 'Tab で「C」に移動して決定しろ',
  hint: 'Tab を連打してボタン C にフォーカスを合わせるんや',
  explanation:
    'Tab キーで要素から要素へ移動する、キーボード操作でいちばんの基本。マウスがなくてもページの中を歩き回れる。',
  Node: TabNavigationQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
