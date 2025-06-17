import Link from 'next/link';

import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { JOB_ROLES_JA, JobRole } from '@/constants/works';
import { getMetadata } from '@/utils/seo';
import clsx from 'clsx';
import Image from 'next/image';
import { useId } from 'react';

export const metadata = getMetadata('/tools');
type TargetUser = JobRole[];
const tools: Array<[string, TargetUser]> = [
  // 追加順
  ['/tools/an-alt-decision-tree', ['developer', 'director', 'planner', 'writer']],
  ['/tools/character-count', []],
  ['/tools/slack-reminder-command-generator', []],
  ['/tools/get-url-from-dom', ['director', 'planner']],
  ['/tools/markup-dev-supporter', ['developer']],
];

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle} shouldShowPrivacyPolicyMessage>
        <p>{metadata.description}</p>
      </PageTitle>

      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools
          .map(([pathname, jobRoles]) => {
            const { pageTitle, description } = getMetadata(pathname);

            return {
              key: pageTitle,
              pageTitle,
              pathname,
              description: description.split('\n'),
              jobRoles: jobRoles.map((role) => {
                return JOB_ROLES_JA[role];
              }),
            };
          })
          .sort((a, b) => a.key.localeCompare(b.key))
          .map(({ key, pageTitle, pathname, description, jobRoles }) => {
            const linkAreaId = `${id}-${pathname}`;

            return (
              <ClickableArea
                key={key}
                as="div"
                className="group relative flex flex-col items-start gap-2 rounded-lg bg-white px-3 py-2 pr-12 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-4 lg:gap-4 lg:p-6"
                defaultClickable={linkAreaId}
              >
                <dt>
                  <Link href={pathname} id={linkAreaId} className="font-bold no-underline group-hover:underline">
                    {pageTitle}
                    <Image
                      src="/common/images/icons/arrow3-right.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="absolute inset-y-0 right-3 my-auto block transition-transform duration-300 group-hover:translate-x-1 sm:static sm:mb-1 sm:ml-1 sm:inline-block sm:size-3 sm:group-hover:transform-none"
                    />
                  </Link>
                </dt>
                <dd
                  className={clsx([
                    'grow text-sm',
                    jobRoles.length !== 0 && 'grid  grid-rows-[1fr,auto] gap-4 pb-2 sm:pb-0 lg:gap-6',
                  ])}
                >
                  <div className="grow">
                    {description.length <= 1 ? (
                      <>{description}</>
                    ) : (
                      description.map((row) => {
                        return (
                          <span key={row} className="inline-block">
                            {row}
                          </span>
                        );
                      })
                    )}
                  </div>

                  {jobRoles.length !== 0 && (
                    <ul className="flex flex-wrap items-center gap-1 text-2xs font-bold lg:-mx-2 lg:-mb-2">
                      {jobRoles.map((role) => {
                        return (
                          <li key={role} className="rounded bg-[#eee] px-2 py-0.5">
                            {`${role}向け`}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </dd>
              </ClickableArea>
            );
          })}
      </dl>

      <h2 className="mb-4 mt-14 text-xl font-bold sm:mb-6 sm:mt-20 sm:text-2xl">Playground</h2>

      <SimpleDescriptionList
        list={[
          '/tools/accessible-name-and-description-computation',
          '/tools/css-units',
          '/tools/dom-events-watcher',
          '/tools/touch-event-touches',
        ]
          .map((pathname) => {
            const data = getMetadata(pathname);

            return {
              key: data.pageTitle,
              title: <Link href={pathname}>{data.pageTitle}</Link>,
              description: data.description.replace(/\n/g, ''),
            };
          })
          .sort((a, b) => a.key.localeCompare(b.key))}
      />
    </>
  );
}
