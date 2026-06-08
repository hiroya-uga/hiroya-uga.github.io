'use client';

import {
  ClipboardEvent,
  FocusEvent,
  InputEvent,
  InputHTMLAttributes,
  Ref,
  forwardRef,
  useId,
  useRef,
  useSyncExternalStore,
} from 'react';

import clsx from 'clsx';

import { Required } from '@/components/ui/media/Required';
import { SvgIcon } from '@/components/ui/media/SvgIcon/SvgIcon';

type Label =
  | {
      label: string;
    }
  | {
      id: string;
    }
  | {
      'aria-labelledby': string;
    };

type BaseProps = Label & {
  value?: string;
  descriptions?: string[];
  description?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  align?: 'left' | 'center' | 'right';
  defaultValue?: string;
  onInput?: (e: InputEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & (
    | {
        multiline: true;
        autoResize?: boolean;
        noResize?: boolean;
        minHeight?: 1 | 2 | 3 | 4 | 5;
      }
    | {
        multiline?: false;
        type?: InputHTMLAttributes<HTMLInputElement>['type'];
        inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
        list?: InputHTMLAttributes<HTMLInputElement>['list'];
        autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
      }
  );

interface Props extends Omit<BaseProps, 'label' | 'description'> {
  autoResize: boolean;
  noResize: boolean;
  minHeight?: 1 | 2 | 3 | 4 | 5;
  id: string;
  descriptionId?: string;
}

const MIN_HEIGHT_CLASSES = {
  1: 'min-h-[calc(1lh+1rem+2px)]',
  2: 'min-h-[calc(2lh+1rem+2px)]',
  3: 'min-h-[calc(3lh+1rem+2px)]',
  4: 'min-h-[calc(4lh+1rem+2px)]',
  5: 'min-h-[calc(5lh+1rem+2px)]',
} as const;

const TextareaComponent = (
  { descriptionId, multiline: _, autoResize, noResize, minHeight, align, ...props }: Readonly<Props>,
  ref: Ref<HTMLTextAreaElement>,
) => {
  const dummyTextareaRef = useRef<HTMLDivElement>(null);
  const textareaHeight = useSyncExternalStore(
    () => () => {},
    () => (dummyTextareaRef.current?.clientHeight ? `${dummyTextareaRef.current?.clientHeight}px` : '0px'),
    () => '0px',
  );

  if (autoResize) {
    return (
      <span className="relative block">
        <span
          className="border-textfield invisible absolute block w-full resize-none whitespace-pre-wrap rounded-md border p-2"
          ref={dummyTextareaRef}
        >
          {props.value?.replaceAll(/\n$/g, '\n　') || '　'}
        </span>
        <textarea
          {...props}
          aria-describedby={descriptionId}
          className={clsx([
            'border-textfield bg-textfield w-full resize-none overflow-hidden rounded-md border p-2',
            minHeight ? MIN_HEIGHT_CLASSES[minHeight] : 'min-h-[calc(1.75lh+1rem)]',
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
        minHeight && MIN_HEIGHT_CLASSES[minHeight],
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
      ])}
      ref={ref}
    />
  );
};

const Textarea = forwardRef(TextareaComponent);
const TextFieldComponent = (
  { descriptions, description, align = 'left', disabled, ...restProps }: BaseProps,
  ref: Ref<HTMLTextAreaElement | HTMLInputElement>,
) => {
  const useIdValue = useId();
  const id = 'id' in restProps ? restProps.id : useIdValue;
  const descriptionId = description ? `${id}-description` : undefined;
  const disabledState = disabled
    ? {
        'aria-disabled': true,
        readOnly: true,
      }
    : {};

  const { label: _, ...commonProps } = {
    label: '',
    ...restProps,
  };

  return (
    <div>
      {'label' in restProps && (
        <p>
          <label htmlFor={id} className="block w-fit text-sm font-bold leading-snug">
            {restProps.label}
            {restProps.required && <Required />}
          </label>
        </p>
      )}

      {(descriptions || description) && (
        <div
          id={descriptionId}
          className="text-secondary ml-0.5 mt-1 grid grid-cols-[1rem_1fr] items-start gap-0.5 text-xs leading-relaxed"
        >
          <p className="mt-2px relative grid size-3.5 place-items-center [--x-fill:var(--x-color-text-secondary)]">
            <SvgIcon name="description" alt="" />
          </p>
          <div>
            {(descriptions ?? description?.split('\n'))?.map((line) => {
              return <p key={line}>{line}</p>;
            })}
          </div>
        </div>
      )}

      <p className="mt-2">
        {commonProps.multiline ? (
          <Textarea
            {...commonProps}
            {...disabledState}
            placeholder={commonProps.placeholder ? `例）${commonProps.placeholder}` : undefined}
            autoResize={commonProps.autoResize ?? false}
            noResize={commonProps.noResize ?? false}
            id={id}
            descriptionId={descriptionId}
            align={align}
            ref={ref as Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...commonProps}
            {...disabledState}
            id={id}
            aria-describedby={descriptionId}
            className={clsx([
              'min-h-12', // for iOS 32px + 8px padding * 2 = 48px
              'border-primary text-textfield bg-textfield text w-full appearance-none rounded-md border p-2 text-left',
              align === 'right' && 'text-right',
              align === 'center' && 'text-center',
            ])}
            placeholder={commonProps.placeholder ? `例）${commonProps.placeholder}` : undefined}
            ref={ref as Ref<HTMLInputElement>}
          />
        )}
      </p>
    </div>
  );
};

export const TextField = forwardRef(TextFieldComponent);
