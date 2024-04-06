import { ReactNode } from 'react';

import clsx from 'clsx';

type LogLevel = 'note' | 'warn' | 'error';

const getTitle = (level: LogLevel) => {
  switch (level) {
    case 'error':
      return 'Error';
    case 'warn':
      return 'Warn';
    default:
      return 'Note';
  }
};

export const NoteBox = ({
  title,
  headingLevel = 3,
  logLevel = 'note',
  children,
}: {
  title?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  logLevel?: LogLevel;
  children: ReactNode;
}) => {
  const TagName = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <aside
      className={clsx([
        'rounded-md border border-gray-400 p-4',
        logLevel === 'note' && 'bg-green-50',
        logLevel === 'warn' && 'bg-yellow-50',
        logLevel === 'error' && 'bg-red-50',
      ])}
    >
      <TagName
        className={clsx([
          'mb-2 mt-0 text-lg font-bold leading-relaxed',
          logLevel === 'note' && 'text-green-800',
          logLevel === 'warn' && 'text-yellow-800',
          logLevel === 'error' && 'text-red-800',
        ])}
      >
        <span className="pr-2 font-emoji">
          {logLevel === 'note' && '💡'}
          {logLevel === 'warn' && '⚠️'}
          {logLevel === 'error' && '🚨'}
        </span>
        {title ?? getTitle(logLevel)}
      </TagName>
      {children}
    </aside>
  );
};
