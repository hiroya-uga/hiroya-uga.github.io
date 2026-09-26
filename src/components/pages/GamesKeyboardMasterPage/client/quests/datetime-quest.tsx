'use client';

import { useId } from 'react';
import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const DATETIME_INITIAL = '2026-01-01T00:00';
const DATETIME_TARGET = '2026-12-25T18:30';

const DatetimeQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const id = useId();

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-lg font-bold">
        日時
      </label>
      <input
        id={id}
        type="datetime-local"
        defaultValue={DATETIME_INITIAL}
        className="border-primary px-16PX py-8PX rounded border text-2xl"
        onChange={(e) => {
          if (e.currentTarget.value === DATETIME_TARGET) {
            onClear();
          }
        }}
      />
    </div>
  );
};

export const datetimeQuest: NodeQuest = {
  type: 'node',
  title: '日時を2026年12月25日の18:30に合わせろ',
  hint: '年・月・日・時・分の欄に数字を打つか、↑↓で値を変える。欄の移動は← →かTab。午前・午後の欄があれば午後にする',
  explanation:
    '日付と時刻の入力欄は、カレンダーを開かなくても、数字キーを打つか↑↓で値を変えられる。← →やTabで年・月・日・時・分の欄を移動できるから、マウスなしで指定の日時に合わせられる。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: DatetimeQuestNode,
};
