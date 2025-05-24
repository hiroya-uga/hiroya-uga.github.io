'use client';

import { useId, useMemo } from 'react';
import { Radio } from '@/components/Form';

type DayProps = {
  value: number;
  dispatch: React.Dispatch<React.SetStateAction<number>>;
};

export const DaySection = ({ value, dispatch }: DayProps) => {
  const name = useId();
  const days = useMemo(() => ['月', '火', '水', '木', '金', '土', '日'], []);

  return (
    <fieldset className="mb-8">
      <legend className="mb-2 text-sm font-bold leading-snug">曜日</legend>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {days.map((dayName, index) => {
          return (
            <li key={index}>
              <Radio
                label={`${dayName}曜日`}
                checked={value === index}
                name={name}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    dispatch(index);
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
