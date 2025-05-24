'use client';
import { useMemo } from 'react';
import { Checkbox } from '@/components/Form';

type DaysProps = {
  values: boolean[];
  dispatch: React.Dispatch<React.SetStateAction<boolean[]>>;
};

export const isWeekday = (values: DaysProps['values']) => {
  return values.slice(0, 5).filter(Boolean).length === 5;
};

export const DaysSection = ({ values, dispatch }: DaysProps) => {
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
                dispatch([true, true, true, true, true, values[5], values[6]]);
                return;
              }

              dispatch([false, false, false, false, false, values[5], values[6]]);
            }}
          />
        </li>
        {days.map((dayName, index) => {
          return (
            <li key={index}>
              <Checkbox
                label={`${dayName}曜日`}
                checked={values[index]}
                onChange={(e) => {
                  const newDay = [...values];
                  newDay[index] = e.currentTarget.checked;
                  dispatch(newDay);
                }}
              />
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
};
