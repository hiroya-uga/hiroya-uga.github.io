'use client';

import { useId, useRef, useState } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const TABS = [
  { label: 'りんご', description: '赤くて丸い果物です。' },
  { label: 'みかん', description: 'こたつで食べる果物です。' },
  { label: 'ぶどう', description: '房でなる果物です。' },
];
const TARGET_INDEX = 2;

const TabsSwitchQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const id = useId();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setSelectedIndex(index);
    tabRefs.current[index]?.focus();

    if (index === TARGET_INDEX) {
      onClear();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="果物" className="flex gap-2">
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === selectedIndex}
            aria-controls={`${id}-panel-${index}`}
            // 選択中のタブだけが Tab キーの停止位置になる。他のタブへは矢印キーで移る
            tabIndex={index === selectedIndex ? 0 : -1}
            className="border-primary px-16PX py-8PX aria-selected:bg-secondary rounded-t border text-xl aria-selected:font-bold"
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            onClick={() => {
              select(index);
            }}
            onKeyDown={(e) => {
              // 矢印キーで動かした時点で表示も切り替える(自動アクティベーション)
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                select((index + 1) % TABS.length);
                return;
              }

              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                select((index + TABS.length - 1) % TABS.length);
                return;
              }

              if (e.key === 'Home') {
                e.preventDefault();
                select(0);
                return;
              }

              if (e.key === 'End') {
                e.preventDefault();
                select(TABS.length - 1);
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {TABS.map((tab, index) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selectedIndex}
          tabIndex={0}
          className="border-primary p-16PX rounded-b border text-lg"
        >
          {tab.description}
        </div>
      ))}
    </div>
  );
};

export const tabsSwitchQuest: NodeQuest = {
  type: 'node',
  title: 'タブを矢印キーで切り替えて、「ぶどう」を表示しろ',
  hint: 'Tabでタブに移動して、→を2回押す',
  explanation:
    'タブは、Tabキーでタブの並びに入って、←→で隣のタブに切り替える。Tabキーを押しても他のタブには止まらず、次は中身のパネルに進む。Home / Endで最初と最後のタブにも飛べる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: TabsSwitchQuestNode,
};
