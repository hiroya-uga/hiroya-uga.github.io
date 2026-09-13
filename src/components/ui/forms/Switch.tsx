'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import clsx from 'clsx';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  dispatch?: Dispatch<SetStateAction<boolean>>;
  label?: string;
};

export const Switch = ({ dispatch, label, ...props }: Readonly<Props>) => {
  const state = useState(props.checked ?? props.defaultChecked ?? false);
  const isChecked = props.checked ?? state[0];
  const setIsChecked = dispatch ?? state[1];

  const content = (
    <span
      className={clsx([
        'w-64PX min-w-64PX h-32PX relative block cursor-default rounded-full border',
        'transition-[opacity_border-color_background-color]',
        'before:absolute before:left-px before:top-px',
        'before:aspect-square before:h-[calc(100%-2px)] before:bg-white',
        'before:rounded-[50%] before:transition-transform',
        isChecked && 'before:translate-x-32PX',
        isChecked ? 'border-green-400 bg-green-400' : 'border-secondary bg-gray-400',
        props.disabled && 'opacity-40',
      ])}
    >
      <input
        {...props}
        type="checkbox"
        role="switch"
        checked={isChecked}
        className="absolute inset-0 size-full appearance-none rounded-full"
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e);
          }

          setIsChecked(e.currentTarget.checked);
        }}
      />
    </span>
  );

  if (typeof label === 'string' && label !== '') {
    return (
      <label className="gap-8PX flex items-center justify-between text-sm">
        <span>{label}</span>
        {content}
      </label>
    );
  }

  return content;
};
