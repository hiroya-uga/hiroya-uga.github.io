import { ReactNode, useId, useState } from 'react';

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

export const Details = ({
  defaultOpen = false,
  name,
  summary,
  children,
}: {
  defaultOpen?: boolean;
  name?: string;
  summary: React.ReactNode;
  children: React.ReactNode;
}) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      className="group rounded-lg first:last:border first:last:border-slate-400 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-solid [&:not(:first-child)]:border-t-gray-200"
      open={isOpen}
      id={id}
      // @ts-ignore
      name={name}
    >
      <summary
        className="after:hidden flex cursor-pointer list-none items-center justify-between sm:text-lg text-secondary-900 bg-slate-100 group-first:rounded-t-lg group-last:rounded-b-lg group-last:group-open:rounded-none relative focus:z-10 group-first:group-last:text-base group-first:group-last:py-3 group-first:group-last:bg-slate-200 group-first:group-last:sm:hover:bg-slate-300 group-first:group-last:sm:transition-colors group-first:group-last:sm:duration-200 group-first:group-last:group-open:rounded-t-lg"
        role="button"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls={id}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <div className="px-4 py-2">{summary}</div>
        <div className="w-[32px] mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="#777"
            strokeWidth="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="transition-all duration-300 group-open:rotate-180"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </summary>

      <div className="bg-white group-last:rounded-b-lg overflow-hidden">{children}</div>
    </details>
  );
};
