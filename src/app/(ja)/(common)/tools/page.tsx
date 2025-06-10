import Link from 'next/link';

import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} shouldShowPrivacyPolicyMessage>
        <p>{metadata.description}</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
          '/tools/slack-reminder-command-generator',
          '/tools/get-url-from-dom',
          '/tools/an-alt-decision-tree',
          '/tools/character-count',
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
