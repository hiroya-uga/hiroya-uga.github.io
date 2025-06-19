import { ReactNode, type JSX } from 'react';

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

export const NoteBox = ({ title, headingLevel = 3, type = 'note', children }: Props) => {
  const TagName = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <section
      className={clsx([
        'rounded-md border border-gray-400 p-4',
        type === 'note' && 'bg-green-50',
        type === 'warn' && 'bg-yellow-50',
        type === 'error' && 'bg-red-50',
      ])}
    >
      <TagName
        className={clsx([
          'mb-2 mt-0 text-lg font-bold leading-relaxed',
          type === 'note' && 'text-green-800',
          type === 'warn' && 'text-yellow-800',
          type === 'error' && 'text-red-800',
        ])}
      >
        <span className="pr-2 font-emoji">
          {type === 'note' && '💡'}
          {type === 'warn' && '⚠️'}
          {type === 'error' && '🚨'}
        </span>
        {title ?? getTitle(type)}
      </TagName>
      {children}
    </section>
  );
};
