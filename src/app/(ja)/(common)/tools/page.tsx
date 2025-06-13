import Link from 'next/link';

import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';
import Image from 'next/image';
import { useId } from 'react';

export const metadata = getMetadata('/tools');

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.pageTitle} shouldShowPrivacyPolicyMessage>
        <p>{metadata.description}</p>
      </PageTitle>

      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          '/tools/slack-reminder-command-generator',
          '/tools/get-url-from-dom',
          '/tools/an-alt-decision-tree',
          '/tools/character-count',
          '/tools/table-dev-supporter',
        ]
          .map((pathname) => {
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
                className="group relative items-start rounded-lg bg-white px-3 py-2 pr-12 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-4 lg:p-6"
                defaultClickable={linkAreaId}
              >
                <dt className="mb-2">
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
                <dd className="text-sm">
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
