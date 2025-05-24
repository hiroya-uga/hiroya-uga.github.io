'use client';

import { useId } from 'react';

type Props = {
  label: string;
  checked: boolean;
  name: string;
  onChange: React.FormEventHandler<HTMLInputElement>;
};

export const Radio = ({ label, ...props }: Props) => {
  const id = useId();

  return (
    <span className="grid w-fit grid-cols-[auto_1fr] items-center">
      <input {...props} type="radio" id={id} className="size-4 rounded-full border border-gray-300 p-2" />
      <label htmlFor={id} className="pl-2 text-sm leading-snug">
        {label}
      </label>
    </span>
  );
};
