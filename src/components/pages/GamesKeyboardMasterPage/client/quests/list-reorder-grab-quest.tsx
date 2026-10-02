'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useRef, useState } from 'react';
import { useReorderableList } from '../hooks';
import type { NodeQuest, QuestNodeProps } from './types';

const INITIAL_ITEMS = ['A', 'B', 'C'];
const TARGET_ITEM = 'C';

const ListReorderGrabQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [grabbedItem, setGrabbedItem] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const { items, setItems, move, registerItemRef, focusItem } = useReorderableList({ initialItems: INITIAL_ITEMS });
  // Escape で掴む前の並びへ戻すために控えておく
  const itemsBeforeGrabRef = useRef(INITIAL_ITEMS);

  // Space・Enter・クリックはどれも click として届くので、掴む・置くの切り替えはここに集約する
  const handleToggle = (item: string) => {
    if (grabbedItem === null) {
      itemsBeforeGrabRef.current = items;
      setGrabbedItem(item);
      setAnnouncement(`${item}を掴みました`);
      return;
    }

    // 掴んでいる項目以外のボタンを押しても drop 扱いにしない（stale な grabbedItem での誤判定を防ぐ）
    if (item !== grabbedItem) {
      return;
    }

    setGrabbedItem(null);
    setAnnouncement(`${item}を${items.indexOf(item) + 1}番目に置きました`);

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
              ref={registerItemRef(item)}
              onFocus={() => {
                focusItem(item);
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
    '並べ替えできるリストには、Spaceで項目を掴んで、矢印キーで動かして、もう一度Spaceで置くものがある。掴んでいる途中でEscapeを押すと、元の並びに戻せる実装もある。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: ListReorderGrabQuestNode,
};
