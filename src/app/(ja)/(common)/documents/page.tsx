import Link from 'next/link';

import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} description={metadata.description} />

      <SimpleDescriptionList
        list={['/documents/translations', '/documents/notes', '/documents/media', '/documents/fantasized-specs']
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
