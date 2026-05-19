import { ReactNode, useId, type JSX } from 'react';

import clsx from 'clsx';

type Props = {
  title?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  type?: 'note' | 'warn' | 'error';
  children: ReactNode;
};

const getTitle = (level: NonNullable<Props['type']>) => {
  switch (level) {
    case 'error':
      return 'Error';
    case 'warn':
      return 'Warn';
    default:
      return 'Note';
  }
};

export const NoteBox = ({ title, headingLevel = 3, type = 'note', children }: Readonly<Props>) => {
  const id = useId();
  const TagName = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <section
      aria-labelledby={id}
      className={clsx([
        '@container border-secondary pb-6.5 rounded-md border px-2.5 pt-5',
        type === 'note' && 'bg-green-50 dark:bg-[#004b20]',
        type === 'warn' && 'bg-yellow-50 dark:bg-[#4a4401]',
        type === 'error' && 'bg-red-50',
      ])}
    >
      <TagName
        id={id}
        className={clsx([
          'mb-2 mt-0 flex text-lg font-bold leading-relaxed',
          type === 'note' && 'text-green-800 dark:text-white',
          type === 'warn' && 'text-yellow-800 dark:text-white',
          type === 'error' && 'text-red-800',
        ])}
      >
        <span className="font-emoji pr-2">
          {type === 'note' && '💡'}
          {type === 'warn' && '⚠️'}
          {type === 'error' && '🚨'}
        </span>
        <span>{title ?? getTitle(type)}</span>
      </TagName>
      <div className="@w360:px-26px px-6PX">{children}</div>
    </section>
  );
};
