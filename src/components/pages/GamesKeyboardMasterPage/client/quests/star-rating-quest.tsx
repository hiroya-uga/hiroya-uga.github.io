'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const STARS = [1, 2, 3, 4, 5];
const TARGET = 3;

const StarRatingQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [rating, setRating] = useState(0);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold">評価</legend>
      <p className="flex flex-wrap leading-none">
        {STARS.map((star) => (
          <label
            key={star}
            className="has-focus-visible:outline-link has-focus-visible:outline-2 p-4PX relative rounded-full text-5xl"
          >
            <input
              type="radio"
              name="keyboard-master-star-rating-quest"
              className="absolute inset-0 opacity-0"
              checked={rating === star}
              onChange={() => {
                setRating(star);

                if (star === TARGET) {
                  onClear();
                }
              }}
            />
            <span aria-hidden="true">{star <= rating ? '★' : '☆'}</span>
            <span className="sr-only">{`${star}つ星`}</span>
          </label>
        ))}
      </p>
    </fieldset>
  );
};

export const starRatingQuest: NodeQuest = {
  type: 'node',
  title: `ラジオボタンでできている評価を星${TARGET}つにしろ`,
  hint: '星にフォーカスを合わせて、矢印キーで選ぶ',
  explanation:
    '星評価には、見た目は星でも、中身はラジオボタンでできているタイプがある。ラジオと同じく、Tabで1つ目にフォーカスしたら、あとは矢印キーで星を選べる。星の数だけTabを押す必要はない。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: StarRatingQuestNode,
};
