import { useState } from 'react';

import clsx from 'clsx';

type Props = Omit<React.InputHTMLAttributes<HTMLElement>, 'type'>;

export const Switch = (props: Props) => {
  const [isChecked, setIsChecked] = useState(props.checked);

  return (
    <span
      className={clsx([
        'relative block h-8 w-16 cursor-default rounded-full border',
        'transition-[opacity_border-color_background-color]',
        'before:absolute before:left-[1px] before:top-[1px]',
        'before:aspect-square before:h-[calc(100%_-_2px)] before:bg-white',
        'before:rounded-[50%] before:transition-transform',
        isChecked && 'before:translate-x-8',
        isChecked ? 'border-green-400 bg-green-400' : 'border-gray-400 bg-gray-400',
        props.disabled && 'opacity-40',
      ])}
    >
      <input
        {...props}
        type="checkbox"
        role="switch"
        className="absolute inset-0 h-full w-full appearance-none"
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e);
          }

          setIsChecked(e.currentTarget.checked);
        }}
      />
    </span>
  );
};
