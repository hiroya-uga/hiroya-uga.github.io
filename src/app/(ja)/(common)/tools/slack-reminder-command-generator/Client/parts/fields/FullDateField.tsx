'use client';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { TextField } from '@/components/Form';

type FullDateValue = SlackReminder.FormState['fullDate'];

type Props = {
  value: FullDateValue;
  handleChange: (value: FullDateValue) => void;
};

export const FullDateField = ({ value, handleChange }: Props) => {
  return (
    <div className="mb-10">
      <TextField type="date" label="日付" value={value} onInput={(e) => handleChange(e.currentTarget.value)} />
    </div>
  );
};
