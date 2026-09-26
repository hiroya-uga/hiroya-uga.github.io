'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_ITEMS = ['A', 'B', 'C'];
const TARGET_ITEM = 'C';

const ListReorderGrabQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [grabbedItem, setGrabbedItem] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusedItemRef = useRef<string | null>(null);
  // Escape で掴む前の並びへ戻すために控えておく
  const itemsBeforeGrabRef = useRef(INITIAL_ITEMS);

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
  };

  // Space・Enter・クリックはどれも click として届くので、掴む・置くの切り替えはここに集約する
  const handleToggle = (item: string) => {
    if (grabbedItem === null) {
      itemsBeforeGrabRef.current = items;
      setGrabbedItem(item);
      setAnnouncement(`${item}を掴みました`);
      return;
    }

    setGrabbedItem(null);
    setAnnouncement(`${grabbedItem}を${items.indexOf(grabbedItem) + 1}番目に置きました`);

    if (items[0] === TARGET_ITEM) {
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
              aria-pressed={grabbedItem === item}
              className="border-secondary px-16PX py-8PX aria-pressed:bg-secondary w-full rounded border text-xl aria-pressed:border-dashed aria-pressed:-outline-offset-4"
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
              onClick={() => {
                handleToggle(item);
              }}
              onKeyDown={(e) => {
                if (grabbedItem !== item) {
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
                  return;
                }

                if (e.key === 'Escape') {
                  e.preventDefault();
                  setItems(itemsBeforeGrabRef.current);
                  setGrabbedItem(null);
                  setAnnouncement('元の並びに戻しました');
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

export const listReorderGrabQuest: NodeQuest = {
  type: 'node',
  title: 'リストの「C」を掴んで、一番上に動かして置け',
  hint: '「C」にフォーカスを合わせて、Spaceで掴む。↑を2回押したら、もう一度Spaceで置く',
  explanation:
    '並べ替えできるリストには、Spaceで項目を掴んで、矢印キーで動かして、もう一度Spaceで置くものがある。掴んでいる途中でEscapeを押すと、元の並びに戻せる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: ListReorderGrabQuestNode,
};
