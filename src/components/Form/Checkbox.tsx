'use client';

import { useId } from 'react';

type Props = {
  label: string;
  checked: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
};

export const Checkbox = ({ label, ...props }: Props) => {
  const id = useId();

  return (
    <span className="grid w-fit grid-cols-[auto_1fr] items-center">
      <input {...props} type="checkbox" id={id} className="size-4 rounded-md border border-gray-300 p-2" />
      <label htmlFor={id} className="pl-2 text-sm leading-snug">
        {label}
      </label>
    </span>
  );
};
