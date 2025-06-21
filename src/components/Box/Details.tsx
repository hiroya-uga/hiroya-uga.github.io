'use client';

import { useState } from 'react';

export const Details = ({
  defaultOpen = false,
  name,
  summary,
  children,
  id,
}: {
  defaultOpen?: boolean;
  name?: string;
  summary: React.ReactNode;
  children: React.ReactNode;
  id: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      className="group rounded-lg first:last:border first:last:border-slate-400 not-first:border-t not-first:border-solid not-first:border-t-gray-200"
      open={isOpen}
      id={id}
      // @ts-ignore
      name={name}
    >
      <summary
        className="text-secondary-900 relative flex cursor-pointer list-none items-center justify-between bg-slate-100 after:hidden focus:z-10 group-first:rounded-t-lg group-last:rounded-b-lg group-first:group-last:bg-slate-200 group-first:group-last:py-3 group-first:group-last:text-base group-last:group-open:rounded-none group-first:group-last:group-open:rounded-t-lg sm:text-lg group-first:group-last:sm:transition-colors group-first:group-last:sm:duration-200 group-first:group-last:sm:hover:bg-slate-300"
        role="button"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls={id}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <div className="px-4 py-2">{summary}</div>
        <div className="mr-2 w-[32px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="#777"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 group-open:rotate-180"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </summary>

      <div className="overflow-hidden bg-white group-last:rounded-b-lg">{children}</div>
    </details>
  );
};
