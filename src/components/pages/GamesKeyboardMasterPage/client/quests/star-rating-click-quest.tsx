'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const STARS = [1, 2, 3, 4, 5];
const TARGET = 3;

const StarRatingClickQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [rating, setRating] = useState(0);

  return (
    <div role="group" aria-labelledby="keyboard-master-star-rating-click-quest-label">
      <p id="keyboard-master-star-rating-click-quest-label" className="mb-2 text-sm font-bold leading-snug">
        評価
      </p>
      <div className="flex">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star}つ星`}
            aria-pressed={star === rating}
            className="rounded text-5xl"
            onClick={(e) => {
              setRating(star);

              if (star === TARGET && e.detail === 0) {
                onClear();
              }
            }}
          >
            <span aria-hidden="true">{star <= rating ? '★' : '☆'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const starRatingClickQuest: NodeQuest = {
  type: 'node',
  title: `ボタンでできている評価を星${TARGET}つにしろ`,
  hint: 'フォーカスを星に合わせて、ひとつずつずらしていく。目的の星でEnterかSpaceを押す',
  explanation:
    '星評価には、星のひとつひとつがボタンでできているタイプもある。この場合はラジオボタンと違って矢印キーでは移動せず、Tabでひとつずつ移動して、EnterかSpaceで押すことが多い。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: StarRatingClickQuestNode,
};
