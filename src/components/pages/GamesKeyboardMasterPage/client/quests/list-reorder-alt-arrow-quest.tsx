'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_ITEMS = ['A', 'B', 'C'];
const TARGET_ITEM = 'C';

const ListReorderAltArrowQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [announcement, setAnnouncement] = useState('');
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusedItemRef = useRef<string | null>(null);

  // 並び替えで DOM ノードが付け替わるとフォーカスが外れるので、動かした項目へ戻す
  useEffect(() => {
    if (focusedItemRef.current === null) {
      return;
    }

    itemRefs.current.get(focusedItemRef.current)?.focus();
  }, [items]);

  const move = (item: string, offset: -1 | 1) => {
    const from = items.indexOf(item);
    const to = from + offset;

    if (0 > to || to >= items.length) {
      return;
    }

    const next = [...items];
    next.splice(from, 1);
    next.splice(to, 0, item);

    focusedItemRef.current = item;
    setItems(next);
    setAnnouncement(`${item}を${to + 1}番目に移動しました`);

    if (next[0] === TARGET_ITEM) {
      onClear();
    }
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              className="border-primary px-16PX py-8PX w-full rounded border text-xl"
              ref={(element) => {
                if (element === null) {
                  itemRefs.current.delete(item);
                  return;
                }

                itemRefs.current.set(item, element);
              }}
              onFocus={() => {
                focusedItemRef.current = item;
              }}
              onKeyDown={(e) => {
                if (e.altKey === false) {
                  return;
                }

                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  move(item, -1);
                  return;
                }

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  move(item, 1);
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
  title: 'リストの「C」を Alt+↑ で一番上に動かせ',
  hint: '並べ替えできるリストは、項目にフォーカスして Alt+↑↓（Mac は Option+↑↓）で動かせるんや。15秒以内に Tab で「C」へ移動して、Alt+↑ を2回押せ',
  explanation:
    '並べ替えできるリストは、ドラッグだけの操作ではない。項目にフォーカスして Alt+↑↓（Mac は Option+↑↓）を押せば、マウスなしでも順番を変えられる画面がある。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: ListReorderAltArrowQuestNode,
};
