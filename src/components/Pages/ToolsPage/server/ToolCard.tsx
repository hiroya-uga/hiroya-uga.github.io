import Link from 'next/link';
import { useId } from 'react';

import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { SvgIcon } from '@/components/Icons';
import clsx from 'clsx';

interface Props {
  pageTitle: string;
  pathname: string;
  description: string[];
  jobRoles: string[];
}

export const ToolCard = ({ pageTitle, pathname, description, jobRoles }: Props) => {
  const id = useId();
  const linkAreaId = `${id}-link`;

  return (
    <ClickableArea
      as="div"
      className="bg-secondary @w640:p-4 @w640:lg:gap-4 @w640:lg:p-6 group relative flex flex-col items-start gap-2 rounded-lg px-3 py-2 pr-12 shadow-md transition-shadow duration-300 hover:shadow-lg"
      defaultClickable={linkAreaId}
    >
      <dt className={clsx(/^[a-zA-Z\s-]+$/.test(pageTitle) || 'text-balance')}>
        <Link href={pathname} id={linkAreaId} className="font-bold no-underline group-hover:underline">
          {pageTitle}
          <span className="@w640:relative @w640:mb-1 @w640:ml-1 @w640:right-0 @w640:align-middle @w640:inline-block @w640:size-3 @w640:group-hover:transform-none absolute inset-y-0 right-3 my-auto block size-4 transition-transform duration-300 group-hover:translate-x-1">
            <SvgIcon name="arrow-right" alt="" />
          </span>
        </Link>
      </dt>
      <dd
        className={clsx([
          'grow text-sm',
          jobRoles.length !== 0 && '@w640:pb-0 @w640:lg:gap-6 grid grid-rows-[1fr_auto] gap-4 pb-2',
        ])}
      >
        <div className="grow">
          {description.length <= 1 ? (
            <>{description}</>
          ) : (
            description.map((row) => (
              <span key={row} className="inline-block">
                {row}
              </span>
            ))
          )}
        </div>

        {jobRoles.length !== 0 && (
          <ul className="text-2xs @w640:lg:-mx-2 @w640:lg:-mb-2 flex flex-wrap items-center gap-1 font-bold">
            {jobRoles.map((role) => (
              <li key={role} className="rounded bg-[#eee] px-2 py-0.5 text-[#333] dark:bg-[#ccc]">
                {`${role}向け`}
              </li>
            ))}
          </ul>
        )}
      </dd>
    </ClickableArea>
  );
};
