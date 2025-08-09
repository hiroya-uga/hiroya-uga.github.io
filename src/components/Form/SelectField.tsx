'use client';

import { forwardRef, Ref, SelectHTMLAttributes, useId } from 'react';

import clsx from 'clsx';

import { Required } from '@/components/Badge/Required';
import { SvgIcon } from '@/components/Icons/SvgIcon/SvgIcon';

type Props = {
  label: string;
  value?: string;
  description?: string;
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
  { label, description, align = 'left', ...props }: Props,
  ref: Ref<HTMLTextAreaElement | HTMLSelectElement>,
) => {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <>
      <p>
        <label htmlFor={id} className="block w-fit text-sm font-bold leading-snug">
          {label}
          {props.required && <Required />}
        </label>
      </p>

      {description && (
        <div
          id={descriptionId}
          className="text-secondary ml-0.5 mt-1 grid grid-cols-[1rem_1fr] items-start gap-1 text-sm leading-relaxed"
        >
          <p className="pt-3px mt-3px relative grid size-4 place-items-center [--v-fill:var(--v-color-text-secondary)]">
            <SvgIcon name="description" alt="" />
          </p>
          <div>
            {description.split('\n').map((line) => {
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
            'border-primary text-SelectField bg-secondary text w-full appearance-none rounded-md border p-2 text-left',
            align === 'right' && 'text-right',
            align === 'center' && 'text-center',
          ])}
          ref={ref as Ref<HTMLSelectElement>}
        />
      </p>
    </>
  );
};

export const SelectField = forwardRef(SelectFieldComponent);
