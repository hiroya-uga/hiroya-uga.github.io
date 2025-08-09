'use client';

import { useId } from 'react';

type Props = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
  disabled?: boolean;
} & (
  | {
      label: string;
    }
  | {
      'aria-label': string;
    }
);

export const Checkbox = (props: Props) => {
  const id = useId();
  const inputProps = (() => {
    if ('label' in props) {
      const { label: _, ...rest } = props;
      return rest;
    }

    const { 'aria-label': _, ...rest } = props;
    return rest;
  })();

  return (
    <span className="grid w-fit grid-cols-[auto_1fr] items-center">
      <input
        {...inputProps}
        type="checkbox"
        id={id}
        className="size-4 rounded-md border border-gray-300 p-2"
        aria-label={'aria-label' in props ? props['aria-label'] : undefined}
      />
      {'label' in props && (
        <label htmlFor={id} className="pl-2 text-sm leading-snug">
          {props.label}
        </label>
      )}
    </span>
  );
};
