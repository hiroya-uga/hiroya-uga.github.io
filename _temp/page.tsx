import { DocumentScript } from '@/../_temp/DocumentScript';
import '@/../_temp/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'アクセシブル施策の失敗例',
  description: 'Web開発者の物置。',
  twitter: {
    card: 'summary_large_image',
    title: 'アクセシブル施策の失敗例',
    description: 'Web開発者の物置。',
  },
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

      <DocumentScript />
    </>
  );
}
