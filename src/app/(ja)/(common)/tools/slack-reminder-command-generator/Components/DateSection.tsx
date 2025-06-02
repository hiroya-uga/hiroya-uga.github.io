'use client';

import { useId } from 'react';

type DateProps = {
  values: string[];
  dispatch: React.Dispatch<React.SetStateAction<string[]>>;
  label?: string;
};

export const DateSection = ({ values, dispatch, label = '日付' }: DateProps) => {
  const id = useId();
  return (
    <fieldset className="mb-10">
      <legend className="text-sm font-bold leading-snug">{label}</legend>

      <div className="grid w-fit grid-cols-2 gap-2 pt-2">
        <p className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-none outline-2 has-[:focus-visible]:outline-black">
          <input
            type="number"
            min={1}
            max={12}
            id={`${id}-month`}
            value={values[0]}
            className="box-content w-[2ch] px-0.5 py-1 text-center focus-visible:outline-none"
            onInput={(e) => {
              const newDate = [...values];
              newDate[0] = e.currentTarget.value;
              dispatch(newDate);
            }}
          />
          <label htmlFor={`${id}-month`} className="pt-0.5 text-xs leading-none">
            月
          </label>
        </p>
        <p className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 outline-none outline-2 has-[:focus-visible]:outline-black">
          <input
            type="number"
            min={1}
            max={31}
            id={`${id}-day`}
            value={values[1]}
            className="box-content w-[2ch] px-0.5 py-1 text-center focus-visible:outline-none"
            onInput={(e) => {
              const newDate = [...values];
              newDate[1] = e.currentTarget.value;
              dispatch(newDate);
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
