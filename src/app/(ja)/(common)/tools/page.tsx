import Link from 'next/link';

import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { SvgIcon } from '@/components/Icons';
import { TOOLS_LINK_LIST } from '@/constants/link-list';
import { JOB_ROLES_JA } from '@/constants/works';
import { getMetadata } from '@/utils/seo';
import clsx from 'clsx';
import { useId } from 'react';

export const metadata = getMetadata('/tools');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} shouldShowPrivacyPolicyMessage />

      <div className="@container">
        <dl className="@w640:grid-cols-2 @w640:lg:grid-cols-3 grid grid-cols-1 gap-6">
          {TOOLS_LINK_LIST.filter(({ type }) => type === 'default')
            .map(({ pathname, userType }) => {
              const { pageTitle, description } = getMetadata(pathname);

              return {
                key: pageTitle,
                pageTitle,
                pathname,
                description: description.split('\n'),
                jobRoles: userType?.map((role) => {
                  return JOB_ROLES_JA[role];
                }),
              };
            })
            .sort((a, b) => a.key.localeCompare(b.key))
            .map(({ key, pageTitle, pathname, description, jobRoles = [] }) => {
              const linkAreaId = `${id}-${pathname}`;

              return (
                <ClickableArea
                  key={key}
                  as="div"
                  className="bg-banner @w640:p-4 @w640:lg:gap-4 @w640:lg:p-6 group relative flex flex-col items-start gap-2 rounded-lg px-3 py-2 pr-12 shadow-md transition-shadow duration-300 hover:shadow-lg"
                  defaultClickable={linkAreaId}
                >
                  <dt>
                    <Link href={pathname} id={linkAreaId} className="font-bold no-underline group-hover:underline">
                      {pageTitle}
                      <span className="@w640:relative @w640:mb-1 @w640:ml-4 @w640:align-middle @w640:inline-block @w640:size-3 @w640:group-hover:transform-none absolute inset-y-0 right-3 my-auto block size-4 transition-transform duration-300 [--v-fill:var(--color-link)] group-hover:translate-x-1">
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
                      <ul className="text-2xs @w640:lg:-mx-2 @w640:lg:-mb-2 flex flex-wrap items-center gap-1 font-bold">
                        {jobRoles.map((role) => {
                          return (
                            <li key={role} className="rounded bg-[#eee] px-2 py-0.5 text-[#333] dark:bg-[#ccc]">
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
      </div>

      <h2 className="mb-4 mt-14 text-xl font-bold sm:mb-6 sm:mt-20 sm:text-2xl">Playground</h2>

      <SimpleDescriptionList
        list={TOOLS_LINK_LIST.filter(({ type }) => type === 'playground')
          .map(({ pathname }) => {
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
