import Link from 'next/link';

import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { PageTitle } from '@/components/structures/PageTitle';

import { SvgIcon } from '@/components/Icons';
import { GAMES_LINK_LIST } from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';
import { useId } from 'react';

export const metadata = getMetadata('/games');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />

      <div className="@container">
        <dl className="@w640:grid-cols-2 @w640:lg:grid-cols-3 grid grid-cols-1 gap-6">
          {GAMES_LINK_LIST.map(({ pathname }) => {
            const { pageTitle, description } = getMetadata(pathname);

            return {
              key: pageTitle,
              pageTitle,
              pathname,
              description: description.split('\n'),
            };
          })
            .sort((a, b) => a.key.localeCompare(b.key))
            .map(({ key, pageTitle, pathname, description }) => {
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
                      <span className="@w640:relative @w640:mb-1 @w640:ml-4 @w640:align-middle @w640:inline-block @w640:size-3 @w640:group-hover:transform-none absolute inset-y-0 right-3 my-auto block size-4 transition-transform duration-300 group-hover:translate-x-1">
                        <SvgIcon name="arrow-right" alt="" />
                      </span>
                    </Link>
                  </dt>
                  <dd className={clsx(['grow text-sm'])}>
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
                  </dd>
                </ClickableArea>
              );
            })}
        </dl>
      </div>
    </>
  );
}
