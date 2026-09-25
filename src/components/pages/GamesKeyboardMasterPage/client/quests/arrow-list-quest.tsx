'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
import { useEffect, useRef, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const LIST_ITEMS = ['ねこ', 'いぬ', 'うさぎ', 'とり'];
const LIST_ANSWER_INDEX = 2;

const ArrowListQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (activeIndex === -1) {
      return;
    }
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  return (
    <ul className="flex flex-col gap-2" role="listbox">
      {LIST_ITEMS.map((item, index) => (
        <li key={item}>
          <button
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            tabIndex={index === activeIndex || (activeIndex === -1 && index === 0) ? 0 : -1}
            className="border-primary px-16PX py-8PX w-full rounded border text-xl"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((current) => Math.min(current + 1, LIST_ITEMS.length - 1));
                return;
              }

              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((current) => Math.max(current - 1, 0));
                return;
              }

              if (e.key !== 'Enter' && e.key !== ' ') {
                return;
              }

              if (index === LIST_ANSWER_INDEX) {
                onClear();
                return;
              }

              onFail();
            }}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
};

export const arrowListQuest: NodeQuest = {
  type: 'node',
  title: '矢印キーで「うさぎ」を選んで Enter で決定しろ',
  hint: '↑↓ でリストを移動して Enter で確定するんや',
  explanation:
    '実はリストやメニューの中は、Tab キーではなく矢印キーで動くのが定番。Tab キーだと項目ひとつひとつには止まらず、リストごと飛び越えていく。',
  Node: ArrowListQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
