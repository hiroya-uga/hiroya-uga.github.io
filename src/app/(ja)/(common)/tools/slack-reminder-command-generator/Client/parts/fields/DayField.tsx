'use client';

import { useId, useMemo } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { Radio } from '@/components/Form';

type DayValue = SlackReminder.FormState['day'];

type Props = {
  value: DayValue;
  handleChange: (value: DayValue) => void;
};

export const DayField = ({ value, handleChange }: Props) => {
  const name = useId();
  const days = useMemo(() => ['月', '火', '水', '木', '金', '土', '日'], []);

  return (
    <fieldset className="mb-10">
      <legend className="mb-2 text-sm font-bold leading-snug">曜日</legend>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {days.map((dayName, index) => {
          return (
            <li key={dayName}>
              <Radio
                label={`${dayName}曜日`}
                checked={value === index}
                name={name}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    handleChange(index);
                  }
                }}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};
