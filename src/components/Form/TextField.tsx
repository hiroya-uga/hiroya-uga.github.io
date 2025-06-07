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
import Image from 'next/image';

import { Required } from '@/components/Badge/Required';

type Props = {
  label: string;
  value: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
} & (
  | {
      multiline: true;
      autoResize?: boolean;
      onInput?: TextareaHTMLAttributes<HTMLTextAreaElement>['onInput'];
    }
  | {
      multiline?: false;
      type?: InputHTMLAttributes<HTMLInputElement>['type'];
      onInput?: InputHTMLAttributes<HTMLInputElement>['onInput'];
      autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    }
);

const TextareaComponent = (
  {
    descriptionId,
    multiline: _,
    autoResize,
    ...props
  }: Omit<Props, 'label' | 'description'> & {
    autoResize: boolean;
    onInput?: React.FormEventHandler<HTMLTextAreaElement>;
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
          className="invisible absolute block w-full resize-none whitespace-pre-wrap rounded-md border border-gray-300 p-2"
          ref={dummyTextareaRef}
        >
          {props.value.replace(/\n$/g, '\n　') || '　'}
        </span>
        <textarea
          {...props}
          aria-describedby={descriptionId}
          className="min-h-[calc(1.75lh_+_1rem)] w-full resize-none overflow-hidden rounded-md border border-gray-300 p-2"
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
      className="box-content w-full resize-y rounded-md border border-gray-300 p-2"
      ref={ref}
    />
  );
};

const Textarea = forwardRef(TextareaComponent);
const TextFieldComponent = (
  { label, description, ...props }: Props,
  ref: Ref<HTMLTextAreaElement | HTMLInputElement>,
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
          className="ml-0.5 mt-1 grid grid-cols-[1rem_1fr] items-start gap-1 text-sm leading-relaxed text-description"
        >
          <p className="grid place-items-center pt-[0.1875rem]">
            <Image src="/common/images/icons/information.svg" alt="info" className="size-4" width={16} height={16} />
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
            placeholder={props.placeholder ? `例）${props.placeholder}` : undefined}
            autoResize={props.autoResize ?? false}
            id={id}
            descriptionId={descriptionId}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...props}
            id={id}
            aria-describedby={descriptionId}
            className={clsx([
              'min-h-12', // for iOS 32px + 8px padding * 2 = 48px
              'w-full appearance-none rounded-md border border-gray-300 bg-white p-2 text-left',
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
