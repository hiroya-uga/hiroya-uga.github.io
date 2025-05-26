'use client';

import { TextField } from '@/components/Form';

type FullDateProps = {
  value: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

export const TimeSection = ({ value, dispatch }: FullDateProps) => {
  return (
    <div className="mb-10">
      <TextField
        type="time"
        label="通知時刻"
        description="省略すると午前9時にリマインドされます。"
        value={value}
        onInput={(e) => dispatch(e.currentTarget.value)}
      />
    </div>
  );
};
