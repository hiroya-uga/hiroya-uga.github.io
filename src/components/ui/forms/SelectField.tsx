'use client';

import { forwardRef, Ref, SelectHTMLAttributes, useId } from 'react';

import clsx from 'clsx';

import { Required } from '@/components/ui/media/Required';
import { SvgIcon } from '@/components/ui/media/SvgIcon/SvgIcon';
import { formatValidStringArray } from '@/utils/formatter';
import { hasItems } from '@/utils/types';

type Props = {
  label: string;
  value?: string;
  description?: string | string[];
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  align?: 'left' | 'center' | 'right';
  defaultValue?: string;
  children: SelectHTMLAttributes<HTMLSelectElement>['children'];
  onChange: SelectHTMLAttributes<HTMLSelectElement>['onChange'];
};

const SelectFieldComponent = (
  { label, description = [], align = 'left', ...props }: Props,
  ref: Ref<HTMLTextAreaElement | HTMLSelectElement>,
) => {
  const id = useId();
  const descriptions = formatValidStringArray(description);
  const hasDescription = hasItems(descriptions);
  const descriptionId = hasDescription ? `${id}-description` : undefined;

  return (
    <div
      // 親のtext-alignを打ち消す
      className="text-left"
    >
      <p>
        <label htmlFor={id} className="block w-fit text-sm font-bold leading-snug">
          {label}
          {props.required && <Required />}
        </label>
      </p>

      {hasDescription && (
        <div
          id={descriptionId}
          className="text-secondary ml-0.5 mt-1 grid grid-cols-[1rem_1fr] items-start gap-0.5 text-xs leading-relaxed"
        >
          <p className="mt-2px relative grid size-3.5 place-items-center [--x-fill:var(--x-color-text-secondary)]">
            <SvgIcon name="description" alt="" />
          </p>
          <div>
            {descriptions.map((line) => {
              return <p key={line}>{line}</p>;
            })}
          </div>
        </div>
      )}

      <p className="mt-2">
        <select
          {...props}
          id={id}
          aria-describedby={descriptionId}
          className={clsx([
            'border-primary text-textfield bg-textfield text w-full appearance-none rounded-md border p-2 text-left',
            align === 'right' && 'text-right',
            align === 'center' && 'text-center',
          ])}
          ref={ref as Ref<HTMLSelectElement>}
        />
      </p>
    </div>
  );
};

export const SelectField = forwardRef(SelectFieldComponent);
