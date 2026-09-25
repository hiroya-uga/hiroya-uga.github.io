'use client';

import { useId, useState } from 'react';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const INITIAL_ITEMS = ['A', 'B', 'C'];
const TARGET_ITEM = 'C';

const ListReorderQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectedItem, setSelectedItem] = useState(INITIAL_ITEMS[0]);
  const [announcement, setAnnouncement] = useState('');

  const move = (offset: -1 | 1) => {
    const from = items.indexOf(selectedItem);
    const to = from + offset;

    if (to < 0 || items.length <= to) {
      return;
    }

    const next = [...items];
    next.splice(from, 1);
    next.splice(to, 0, selectedItem);
    setItems(next);
    setAnnouncement(`${selectedItem}を${to + 1}番目に移動しました`);

    if (next[0] === TARGET_ITEM) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* フォーカスはリスト自体に置き、選択中の項目は aria-activedescendant で伝える(APG の Listbox パターン) */}
      <ul
        role="listbox"
        aria-label="並べ替えリスト"
        aria-activedescendant={`${id}-${selectedItem}`}
        tabIndex={0}
        className="flex flex-col gap-2"
        onKeyDown={(e) => {
          const index = items.indexOf(selectedItem);

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedItem(items[Math.min(index + 1, items.length - 1)]);
            return;
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedItem(items[Math.max(index - 1, 0)]);
          }
        }}
      >
        {items.map((item) => (
          <li
            key={item}
            id={`${id}-${item}`}
            role="option"
            aria-selected={item === selectedItem}
            className="border-primary px-16PX py-8PX aria-selected:bg-secondary rounded border text-xl aria-selected:font-bold aria-selected:outline aria-selected:outline-2 aria-selected:-outline-offset-2"
            onClick={() => {
              setSelectedItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="flex gap-4">
        <button
          type="button"
          className="border-primary px-16PX py-8PX rounded border"
          onClick={() => {
            move(-1);
          }}
        >
          上へ
        </button>
        <button
          type="button"
          className="border-primary px-16PX py-8PX rounded border"
          onClick={() => {
            move(1);
          }}
        >
          下へ
        </button>
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export const listReorderQuest: NodeQuest = {
  type: 'node',
  title: 'リストの「C」を選んで、「上へ」ボタンで一番上に動かせ',
  hint: '15秒以内に Tab でリストに入って、↓ で「C」を選ぶんや。そのあと Tab で「上へ」ボタンに移動して、Enter か Space を2回押せ',
  explanation:
    '並べ替えできるリストには、項目を選んで「上へ」「下へ」ボタンで動かす作りがある。リストの中は矢印キーで選んで、ボタンは Tab で移動して Enter か Space で押す。ドラッグ以外の手段があれば、マウスなしでも順番を変えられる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: ListReorderQuestNode,
};
