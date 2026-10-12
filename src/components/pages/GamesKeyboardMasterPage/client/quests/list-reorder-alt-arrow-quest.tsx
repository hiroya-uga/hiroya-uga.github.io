'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useState } from 'react';
import { useReorderableList } from '../hooks';
import type { NodeQuest, QuestNodeProps } from './types';

const INITIAL_ITEMS = ['A', 'B', 'C'];
const TARGET_ITEM = 'C';

const ListReorderAltArrowQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [announcement, setAnnouncement] = useState('');
  const { items, move, registerItemRef, focusItem } = useReorderableList({
    initialItems: INITIAL_ITEMS,
    onAfterMove: (next) => {
      if (next[0] === TARGET_ITEM) {
        onClear();
      }
    },
  });

  return (
    <>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              className="border-primary px-16PX py-8PX w-full rounded border text-xl"
              ref={registerItemRef(item)}
              onFocus={() => {
                focusItem(item);
              }}
              onKeyDown={(e) => {
                if (e.altKey === false) {
                  return;
                }

                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  const to = move(item, -1);
                  if (to !== null) {
                    setAnnouncement(`${item}を${to + 1}番目に移動しました`);
                  }
                  return;
                }

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const to = move(item, 1);
                  if (to !== null) {
                    setAnnouncement(`${item}を${to + 1}番目に移動しました`);
                  }
                }
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
};

export const listReorderAltArrowQuest: NodeQuest = {
  type: 'node',
  title: 'リストの「C」をAlt+↑で一番上に動かせ',
  hint: '「C」にフォーカスを合わせて、Alt+↑（MacはOption+↑）を2回押す',
  explanation:
    '並べ替えできるリストは、ドラッグだけの操作とは限らない。項目にフォーカスしてAlt+↑↓（MacはOption+↑↓）を押せば、マウスなしでも順番を変えられる実装がある。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: ListReorderAltArrowQuestNode,
};
