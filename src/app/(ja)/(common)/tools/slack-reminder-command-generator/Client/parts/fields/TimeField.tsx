'use client';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { TextField } from '@/components/Form';

type TimeValue = SlackReminder.FormState['time'];

type Props = {
  value: TimeValue;
  handleChange: (value: TimeValue) => void;
};

export const TimeField = ({ value, handleChange }: Props) => {
  return (
    <div className="mb-10">
      <TextField
        type="time"
        label="通知時刻"
        description="省略すると午前9時にリマインドされます。"
        value={value}
        onInput={(e) => handleChange(e.currentTarget.value)}
      />
    </div>
  );
};
