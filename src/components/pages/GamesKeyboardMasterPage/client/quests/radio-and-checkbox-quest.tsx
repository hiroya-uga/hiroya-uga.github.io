'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { Checkbox } from '@/components/ui/forms/Checkbox';
import { Radio } from '@/components/ui/forms/Radio';
import { useId, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const RADIO_OPTIONS = ['1', '2', '3'];
const RADIO_LEGENDS = ['1つ目', '2つ目'];
const RADIO_ANSWERS = ['2', '3'];

const RadioAndCheckboxQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const nameA = useId();
  const nameB = useId();
  const names = [nameA, nameB];
  const [values, setValues] = useState<(string | null)[]>([null, null]);
  const [isChecked, setIsChecked] = useState(false);

  const judge = (nextValues: (string | null)[], nextIsChecked: boolean) => {
    if (nextIsChecked && nextValues.every((current, i) => current === RADIO_ANSWERS[i])) {
      onClear();
    }
  };

  const handleRadioChange = (groupIndex: number, value: string) => {
    const next = values.map((current, i) => (i === groupIndex ? value : current));
    setValues(next);
    judge(next, isChecked);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    judge(values, checked);
  };

  return (
    <div className="flex flex-col gap-4">
      {RADIO_LEGENDS.map((legend, groupIndex) => (
        <fieldset key={legend}>
          <legend className="mb-2 text-sm font-bold leading-snug">{legend}</legend>
          <ul className="gap-16PX flex flex-wrap">
            {RADIO_OPTIONS.map((option) => (
              <li key={option}>
                <Radio
                  label={option}
                  name={names[groupIndex]}
                  checked={values[groupIndex] === option}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      handleRadioChange(groupIndex, option);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
      <fieldset>
        <legend className="mb-2 text-sm font-bold leading-snug">3つ目</legend>
        <Checkbox
          label="チェックする"
          checked={isChecked}
          onChange={(e) => {
            handleCheckboxChange(e.currentTarget.checked);
          }}
        />
      </fieldset>
    </div>
  );
};

export const radioAndCheckboxQuest: NodeQuest = {
  type: 'node',
  title: '上から「2」「3」を選んで、最後にチェックを入れろ',
  hint: '1つ目は「2」、2つ目は「3」を選んで、3つ目にチェックを入れる',
  explanation:
    'ラジオボタンはSpaceや矢印キー、チェックボックスはSpaceと、部品ごとに操作が違う。複数のグループをまたいでTabで移動しながら操作する応用編。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: RadioAndCheckboxQuestNode,
};
