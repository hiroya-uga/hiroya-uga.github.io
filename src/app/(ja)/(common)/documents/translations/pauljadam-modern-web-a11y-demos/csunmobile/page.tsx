import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/seo';
import Link from 'next/link';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/csunmobile');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle} />
      <p>
        <Link href="https://pauljadam.com/csunmobile/">https://pauljadam.com/csunmobile/</Link>
      </p>
    </>
  );
}
