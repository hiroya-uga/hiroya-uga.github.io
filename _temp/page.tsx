import { DocumentScript } from '@/../_temp/DocumentScript';
import '@/../_temp/page.css';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'アクセシブル施策の失敗例',
  description: 'Web開発者の物置。',
});

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>

      <DocumentScript />
    </>
  );
}
