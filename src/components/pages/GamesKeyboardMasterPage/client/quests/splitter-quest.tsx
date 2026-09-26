'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const MIN = 10;
const MAX = 90;
const STEP = 5;
const INITIAL = 50;
const TARGET = 20;

const SIDEBAR_ITEMS = ['w-4/5', 'w-3/5', 'w-2/3', 'w-1/2'];
const CONTENT_LINES = ['w-full', 'w-11/12', 'w-full', 'w-3/4', 'w-5/6', 'w-1/2'];

const clamp = (value: number) => Math.min(MAX, Math.max(MIN, value));

const SplitterQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const sidebarId = useId();
  const [value, setValue] = useState(INITIAL);

  return (
    <div className="w-lg">
      <div
        className="border-primary grid h-44 rounded border"
        style={{ gridTemplateColumns: `minmax(0, ${value}fr) auto minmax(0, ${100 - value}fr)` }}
      >
        <section id={sidebarId} aria-label="記事" className="bg-secondary overflow-auto">
          <div className="p-16PX grid content-start gap-3">
            <p className="text-sm font-bold">記事</p>
            {SIDEBAR_ITEMS.map((width) => (
              <span key={width} className={`bg-tertiary h-3 rounded-full ${width}`} />
            ))}
          </div>
        </section>

        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label="サイドバーの幅"
          aria-controls={sidebarId}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={value}
          aria-valuetext={`${value}%`}
          className="border-primary bg-tertiary text-secondary outline-link hover:bg-secondary focus-visible:bg-secondary grid w-4 cursor-col-resize place-items-center border-x focus-visible:outline-2 focus-visible:-outline-offset-2"
          onKeyDown={(e) => {
            const next = {
              ArrowLeft: value - STEP,
              ArrowRight: value + STEP,
              Home: MIN,
              End: MAX,
            }[e.key];

            if (next === undefined) {
              return;
            }

            const clamped = clamp(next);
            setValue(clamped);

            if (clamped === TARGET) {
              onClear();
            }
          }}
        >
          <span className="grid gap-1" aria-hidden="true">
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
            <span className="size-1 rounded-full bg-current" />
          </span>
        </div>

        <section aria-label="プレビュー" className="overflow-auto">
          <div className="p-16PX grid content-start gap-3">
            <p className="text-sm font-bold">プレビュー</p>
            {CONTENT_LINES.map((width, index) => (
              <span key={`${width}${index}`} className={`bg-secondary h-3 rounded-full ${width}`} />
            ))}
          </div>
        </section>
      </div>

      <div aria-hidden="true" className="grid gap-1">
        <p className="text-center text-2xl font-bold tabular-nums">{`${value}%`}</p>
      </div>
    </div>
  );
};

export const splitterQuest: NodeQuest = {
  type: 'node',
  title: `サイドバーの幅を${TARGET}%にしろ`,
  hint: '左右の境目にフォーカスを合わせて、←→で幅を変える',
  explanation:
    'パネルの境目（スプリッター）には、ドラッグだけでなく、フォーカスして←→を押せば幅を変えられる作りがある。Home・Endで最小・最大にできるものもある。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: SplitterQuestNode,
};
