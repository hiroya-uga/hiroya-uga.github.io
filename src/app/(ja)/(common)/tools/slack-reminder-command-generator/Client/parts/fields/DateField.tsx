'use client';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { useId } from 'react';

type DateValue = SlackReminder.FormState['date'];

type Props = {
  values: DateValue;
  handleChange: (value: DateValue) => void;
};

export const DateField = ({ values, handleChange }: Props) => {
  const id = useId();
  return (
    <fieldset className="mb-10">
      <legend className="text-sm font-bold leading-snug">日付</legend>

      <div className="grid w-fit grid-cols-2 gap-2 pt-2">
        <p className="outline-hidden has-focus-visible:outline-black flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-2">
          <input
            type="number"
            min={1}
            max={12}
            id={`${id}-month`}
            value={values[0]}
            className="focus-visible:outline-hidden box-content w-[2ch] px-0.5 py-1 text-center"
            onInput={(e) => {
              const newDate = [...values];
              newDate[0] = e.currentTarget.value;
              handleChange(newDate);
            }}
          />
          <label htmlFor={`${id}-month`} className="pt-0.5 text-xs leading-none">
            月
          </label>
        </p>
        <p className="outline-hidden has-focus-visible:outline-black flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-2">
          <input
            type="number"
            min={1}
            max={31}
            id={`${id}-day`}
            value={values[1]}
            className="focus-visible:outline-hidden box-content w-[2ch] px-0.5 py-1 text-center"
            onInput={(e) => {
              const newDate = [...values];
              newDate[1] = e.currentTarget.value;
              handleChange(newDate);
            }}
          />
          <label htmlFor={`${id}-day`} className="pt-0.5 text-xs leading-none">
            日
          </label>
        </p>
      </div>
    </fieldset>
  );
};
