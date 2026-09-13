import { ClickableArea } from '@/components/ui/features/ClickableArea';
import { SvgIcon } from '@/components/ui/media/SvgIcon';
import clsx from 'clsx';
import Link from 'next/link';
import { useId } from 'react';

const Descriptions = ({
  description,
  truncate,
  jobRoles,
}: {
  description: string[];
  truncate: boolean;
  jobRoles: string[];
}) => {
  if (truncate) {
    return (
      <dd className="max-w-full grow text-sm">
        <div className="truncate">{description.join('')}</div>
      </dd>
    );
  }

  return (
    <dd
      className={clsx([
        'grow text-sm',
        jobRoles.length !== 0 && 'w640:pb-0 w640:gap-4 grid grid-rows-[1fr_auto] gap-3 pb-2',
      ])}
    >
      <div className="grow px-1">
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
        <ul className="text-2xs flex flex-wrap items-center gap-1 font-bold">
          {jobRoles.map((role) => (
            <li key={role} className="rounded bg-[#eee] px-2 py-0.5 text-[#333] dark:bg-[#ccc]">
              {`${role}向け`}
            </li>
          ))}
        </ul>
      )}
    </dd>
  );
};

interface Props {
  pageTitle: string;
  pathname: string;
  description: string[];
  jobRoles?: string[];
  truncate?: boolean;
}

export const ToolCard = ({ pageTitle, pathname, description, jobRoles = [], truncate = false }: Props) => {
  const id = useId();
  const linkAreaId = `${id}-link`;

  return (
    <ClickableArea
      as="div"
      className="bg-secondary w640:p-4 group relative flex flex-col items-start gap-2 rounded-lg px-3 py-2 pr-12 shadow-md transition-shadow duration-300 hover:shadow-lg"
      defaultClickable={linkAreaId}
    >
      <dt className={clsx(['px-1', /^[a-zA-Z\s-]+$/.test(pageTitle) || 'text-balance'])}>
        <Link
          href={pathname}
          id={linkAreaId}
          className={clsx([
            'font-bold no-underline group-hover:underline',
            truncate && 'grid grid-cols-[1fr_auto] items-center',
          ])}
        >
          {truncate ? <span className={clsx(['max-w-full truncate'])}>{pageTitle}</span> : pageTitle}
          <span
            className={clsx([
              truncate ? '' : 'w640:mb-1',
              'w640:relative w640:ml-1 w640:right-0 w640:align-middle w640:inline-block w640:size-3 w640:group-hover:transform-none absolute inset-y-0 right-3 my-auto block size-4 transition-transform duration-300 group-hover:translate-x-1',
            ])}
          >
            <SvgIcon name="arrow-right" alt="" />
          </span>
        </Link>
      </dt>

      <Descriptions description={description} truncate={truncate} jobRoles={jobRoles} />
    </ClickableArea>
  );
};
