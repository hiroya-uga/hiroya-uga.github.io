'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
import { NodeQuest, QuestNodeProps } from './types';

const BUTTON_OPTIONS = ['A', 'B', 'C', 'D'];
const BUTTON_ANSWER = 'C';

const FocusAndSpaceQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  return (
    <div className="flex gap-4">
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
  title: 'Tab で「C」に移動して Space で押せ',
  hint: 'Tab でボタン C にフォーカスを合わせて、Enter やなくて Space で押すんや',
  explanation:
    'Tab キーで要素から要素へ移動して、ボタンは Space キーで押せる。Enter でも押せるけど、リンクは Enter だけ、ボタンは Space も使えると覚えておくと区別しやすい。ボタンが Space でも押せるのは、OS のアプリにある本物のボタンが Space で押す作りで、ブラウザの button がそれに合わせているから。ちなみに Enter は押した瞬間、Space は離した瞬間に反応する。',
  Node: FocusAndSpaceQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
