'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { NodeQuest, QuestNodeProps } from './types';

const BUTTON_OPTIONS = ['A', 'B', 'C', 'D'];
const BUTTON_ANSWER = 'C';

const FocusAndSpaceQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    <div className="gap-16PX flex flex-wrap">
      {BUTTON_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="border-primary px-16PX py-8PX rounded border text-2xl"
          onKeyDown={(e) => {
            // ボタンは Enter でも押せるが、このクエストでは Space で押せることを覚えてもらうので Enter は失敗にする
            if (e.key === 'Enter') {
              e.preventDefault();
              onFail();
            }
          }}
          onClick={(e) => {
            // detail === 0 はキーボード操作(Space)経由のクリックのみを通す
            if (e.detail !== 0) {
              return;
            }

            if (option === BUTTON_ANSWER) {
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

export const focusAndSpaceQuest: NodeQuest = {
  type: 'node',
  title: 'Tabで「C」に移動してSpaceで押せ',
  hint: 'ボタンCにフォーカスを合わせて、EnterではなくSpaceで押す',
  explanation:
    'ボタンはEnterだけでなくSpaceでも押せる。リンクはEnterだけなので、そこが見分けるポイント。ちなみにEnterは押した瞬間、Spaceは離した瞬間に反応する。',
  Node: FocusAndSpaceQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
