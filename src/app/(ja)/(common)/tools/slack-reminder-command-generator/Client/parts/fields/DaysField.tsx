'use client';

import { useMemo } from 'react';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { isWeekday } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/utils';
import { Checkbox } from '@/components/Form';

type DaysValue = SlackReminder.FormState['days'];

type Props = {
  values: DaysValue;
  handleChange: (value: DaysValue) => void;
};

export const DaysField = ({ values, handleChange }: Props) => {
  const days = useMemo(() => ['月', '火', '水', '木', '金', '土', '日'], []);

  return (
    <fieldset className="mb-10">
      <legend className="mb-2 text-sm font-bold leading-snug">曜日</legend>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        <li>
          <Checkbox
            label="平日"
            checked={isWeekday(values)}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                handleChange([true, true, true, true, true, values[5], values[6]]);
                return;
              }

              handleChange([false, false, false, false, false, values[5], values[6]]);
            }}
          />
        </li>
        {days.map((dayName, index) => {
          return (
            <li key={dayName}>
              <Checkbox
                label={`${dayName}曜日`}
                checked={values[index]}
                onChange={(e) => {
                  const newDay = [...values];
                  newDay[index] = e.currentTarget.checked;
                  handleChange(newDay);
                }}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};
