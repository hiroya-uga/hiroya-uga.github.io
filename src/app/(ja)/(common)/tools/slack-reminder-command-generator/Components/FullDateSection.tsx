'use client';

import { TextField } from '@/components/Form';

type FullDateProps = {
  value: string;
  dispatch: React.Dispatch<React.SetStateAction<string>>;
};

export const FullDateSection = ({ value, dispatch }: FullDateProps) => {
  return (
    <div className="mb-8">
      <TextField type="date" label="日付" value={value} onInput={(e) => dispatch(e.currentTarget.value)} />
    </div>
  );
};
