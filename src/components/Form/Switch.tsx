import { useState } from 'react';

import clsx from 'clsx';

type Props = Omit<React.InputHTMLAttributes<HTMLElement>, 'type'>;

export const Switch = (props: Props) => {
  const [isChecked, setIsChecked] = useState(props.checked);

  return (
    <span
      className={clsx([
        'relative block w-16 h-8 border rounded-full cursor-default',
        'transition-[opacity_border-color_background-color]',
        'before:absolute before:left-[1px] before:top-[1px]',
        'before:h-[calc(100%_-_2px)] before:aspect-square before:bg-white',
        'before:transition-transform before:rounded-[50%]',
        isChecked && 'before:translate-x-8',
        isChecked ? 'border-green-400 bg-green-400' : 'border-gray-400 bg-gray-400',
        props.disabled && 'opacity-40',
      ])}
    >
      <input
        {...props}
        type="checkbox"
        role="switch"
        className="absolute inset-0 w-full h-full appearance-none"
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
