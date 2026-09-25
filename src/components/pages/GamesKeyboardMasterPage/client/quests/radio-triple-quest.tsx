'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/client/quests/config';
import { Radio } from '@/components/ui/forms/Radio';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const RADIO_TRIPLE_OPTIONS = ['1', '2', '3'];
const RADIO_TRIPLE_LEGENDS = ['1つ目', '2つ目', '3つ目'];
const RADIO_TRIPLE_ANSWERS = ['2', '3', '1'];

const RadioTripleQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const nameA = useId();
  const nameB = useId();
  const nameC = useId();
  const names = [nameA, nameB, nameC];
  const [values, setValues] = useState<(string | null)[]>([null, null, null]);

  const handleChange = (groupIndex: number, value: string) => {
    const next = values.map((current, i) => (i === groupIndex ? value : current));
    setValues(next);

    if (next.every((current, i) => current === RADIO_TRIPLE_ANSWERS[i])) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {RADIO_TRIPLE_LEGENDS.map((legend, groupIndex) => (
        <fieldset key={legend}>
          <legend className="mb-2 text-sm font-bold leading-snug">{legend}</legend>
          <ul className="flex gap-4">
            {RADIO_TRIPLE_OPTIONS.map((option) => (
              <li key={option}>
                <Radio
                  label={option}
                  name={names[groupIndex]}
                  checked={values[groupIndex] === option}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      handleChange(groupIndex, option);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
    </div>
  );
};

export const radioTripleQuest: NodeQuest = {
  type: 'node',
  title: '上から「2」「3」「1」の順に選べ',
  hint: '10秒以内に3つのラジオグループそれぞれで指定の数字を選ぶんや',
  explanation: '複数のラジオグループをまたいで操作する応用編。ひとつずつ順番に選んでいこう。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioTripleQuestNode,
};
