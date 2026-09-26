'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import clsx from 'clsx';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const LIST_ITEMS = ['ねこ', 'いぬ', 'うさぎ', 'とり'];
const LIST_ANSWER_INDEX = 2;

const ListboxSelectQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    // 項目ごとにフォーカスを移さず、リスト本体にフォーカスを置いたまま aria-activedescendant で現在の項目を示す
    <ul
      role="listbox"
      aria-label="動物"
      aria-activedescendant={`${id}-option-${activeIndex}`}
      tabIndex={0}
      className="border-primary w-fit min-w-48 overflow-hidden rounded border text-xl"
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

        if (e.key === 'Home') {
          e.preventDefault();
          setActiveIndex(0);
          return;
        }

        if (e.key === 'End') {
          e.preventDefault();
          setActiveIndex(LIST_ITEMS.length - 1);
          return;
        }

        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        // Space はページスクロールを起こすので止める
        e.preventDefault();

        if (activeIndex === LIST_ANSWER_INDEX) {
          onClear();
          return;
        }

        onFail();
      }}
    >
      {LIST_ITEMS.map((item, index) => (
        <li
          key={item}
          id={`${id}-option-${index}`}
          role="option"
          className={clsx(['px-16PX py-8PX', index === activeIndex && 'bg-secondary font-bold'])}
          onClick={() => {
            setActiveIndex(index);
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export const listboxSelectQuest: NodeQuest = {
  type: 'node',
  title: 'リストを矢印キーで移動して、「うさぎ」をEnterで決定しろ',
  hint: 'リストにフォーカスを合わせて、↑↓で項目を選び、EnterかSpaceで決定する',
  explanation:
    'リスト（リストボックス）は、Tabキーでリストに入ったら、↑↓で項目を移動して、EnterかSpaceで決定するのが定番。Home / Endで最初と最後の項目にも飛べる。Tabキーは項目ひとつひとつには止まらず、リストごと飛び越えていく。',
  Node: ListboxSelectQuestNode,
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
};
