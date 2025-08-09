'use client';

import {
  forwardRef,
  InputHTMLAttributes,
  Ref,
  TextareaHTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

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
} & (
  | {
      multiline: true;
      autoResize?: boolean;
      noResize?: boolean;
      onInput?: TextareaHTMLAttributes<HTMLTextAreaElement>['onInput'];
      onBlur?: TextareaHTMLAttributes<HTMLTextAreaElement>['onBlur'];
    }
  | {
      multiline?: false;
      type?: InputHTMLAttributes<HTMLInputElement>['type'];
      inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
      onInput?: InputHTMLAttributes<HTMLInputElement>['onInput'];
      onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
      autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    }
);

const TextareaComponent = (
  {
    descriptionId,
    multiline: _,
    autoResize,
    noResize,
    align,
    ...props
  }: Omit<Props, 'label' | 'description'> & {
    autoResize: boolean;
    noResize: boolean;
    onInput?: React.FormEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    id: string;
    descriptionId?: string;
  },
  ref: Ref<HTMLTextAreaElement>,
) => {
  const dummyTextareaRef = useRef<HTMLDivElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('0px');

  useEffect(() => {
    setTextareaHeight(dummyTextareaRef.current?.clientHeight ? `${dummyTextareaRef.current?.clientHeight}px` : '0px');
  }, [props.value]);

  if (autoResize) {
    return (
      <span className="relative block">
        <span
          className="border-textfield invisible absolute block w-full resize-none whitespace-pre-wrap rounded-md border p-2"
          ref={dummyTextareaRef}
        >
          {props.value?.replace(/\n$/g, '\n　') || '　'}
        </span>
        <textarea
          {...props}
          aria-describedby={descriptionId}
          className={clsx([
            'border-textfield bg-textfield min-h-[calc(1.75lh+1rem)] w-full resize-none overflow-hidden rounded-md border p-2',
            align === 'right' && 'text-right',
            align === 'center' && 'text-center',
          ])}
          style={{ height: textareaHeight }}
          ref={ref}
        />
      </span>
    );
  }

  return (
    <textarea
      {...props}
      aria-describedby={descriptionId}
      className={clsx([
        'border-textfield bg-textfield w-full rounded-md border p-2',
        noResize === true ? 'resize-none' : 'resize-y',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
      ])}
      ref={ref}
    />
  );
};

const Textarea = forwardRef(TextareaComponent);
const TextFieldComponent = (
  { label, description, align = 'left', disabled, ...props }: Props,
  ref: Ref<HTMLTextAreaElement | HTMLInputElement>,
) => {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledState = disabled
    ? {
        'aria-disabled': true,
        readOnly: true,
      }
    : {};

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
        {props.multiline ? (
          <Textarea
            {...props}
            {...disabledState}
            placeholder={props.placeholder ? `例）${props.placeholder}` : undefined}
            autoResize={props.autoResize ?? false}
            noResize={props.noResize ?? false}
            id={id}
            descriptionId={descriptionId}
            align={align}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...props}
            {...disabledState}
            id={id}
            aria-describedby={descriptionId}
            className={clsx([
              'min-h-12', // for iOS 32px + 8px padding * 2 = 48px
              'border-primary text-textfield bg-textfield text w-full appearance-none rounded-md border p-2 text-left',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
            ])}
            placeholder={props.placeholder ? `例）${props.placeholder}` : undefined}
            ref={ref as Ref<HTMLInputElement>}
          />
        )}
      </p>
    </>
  );
};

export const TextField = forwardRef(TextFieldComponent);
