'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { getRandomInt } from '@/utils/number';
import { useId } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const YEAR_MIN = 1990;
const MINUTE_STEP = 5;

interface Datetime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const randomDatetime = (): Datetime => ({
  year: getRandomInt(YEAR_MIN, new Date().getFullYear()),
  month: getRandomInt(1, 12),
  day: getRandomInt(1, 28),
  hour: getRandomInt(0, 23),
  minute: getRandomInt(0, 60 / MINUTE_STEP - 1) * MINUTE_STEP,
});

const pad = (value: number) => String(value).padStart(2, '0');

// datetime-local の value 形式
const toValue = ({ year, month, day, hour, minute }: Datetime) =>
  `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;

export const datetimeQuest = (): NodeQuest => {
  const initial = randomDatetime();
  let target = randomDatetime();

  // 初期値のままクリアされないよう、月が同じなら引き直す
  while (target.month === initial.month) {
    target = randomDatetime();
  }

  const initialValue = toValue(initial);
  const targetValue = toValue(target);

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
          defaultValue={initialValue}
          className="border-primary px-16PX py-8PX rounded border font-sans text-2xl tabular-nums"
          onChange={(e) => {
            if (e.currentTarget.value === targetValue) {
              onClear();
            }
          }}
        />
      </div>
    );
  };

  return {
    type: 'node',
    title: `日時を${target.year}年${target.month}月${target.day}日の${pad(target.hour)}:${pad(target.minute)}に合わせろ`,
    hint: '年・月・日・時・分の欄に数字を打つか、↑↓で値を変える。欄の移動は← →かTab。午前・午後の欄があれば、それも合わせる',
    explanation:
      '日付と時刻の入力欄には、カレンダーを開かなくても、数字キーを打つか↑↓で値を変えられるものがある。← →やTabで年・月・日・時・分の欄を移動できる実装が多く、マウスなしでも指定の日時に合わせられる。',
    timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
    Node: DatetimeQuestNode,
  };
};
