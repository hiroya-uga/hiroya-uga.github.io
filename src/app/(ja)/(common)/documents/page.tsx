import Link from 'next/link';

import { PageTitle } from '@/components/structures/PageTitle';
import { SimpleDescriptionList } from '@/components/ui/server/lists/SimpleDescriptionList';
import { DOCUMENTS_LINK_LIST } from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />

      <SimpleDescriptionList
        list={DOCUMENTS_LINK_LIST.map(({ pathname }) => {
          const { pageTitle, description } = getMetadata(pathname);

          return {
            key: pageTitle,
            title: <Link href={pathname}>{pageTitle}</Link>,
            description: description.replace(/\n/g, ''),
          };
        }).sort((a, b) => a.key.localeCompare(b.key))}
      />
    </>
  );
}
