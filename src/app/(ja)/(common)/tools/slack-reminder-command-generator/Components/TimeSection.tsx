'use client';

import { TextField } from '@/components/Form';

type FullDateProps = {
  value: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

export const TimeSection = ({ value, dispatch }: FullDateProps) => {
  return (
    <div className="mb-10">
      <TextField type="time" label="通知時刻" value={value} onInput={(e) => dispatch(e.currentTarget.value)} />
    </div>
  );
};
