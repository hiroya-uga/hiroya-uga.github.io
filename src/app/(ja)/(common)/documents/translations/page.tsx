import { TranslationsToc } from '@/components/includes/documents/TranslationsToc';

import { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1 className="mb-0">日本語訳集</h1>
      <p className="mb-12">仕様書など、外部資料を日本語訳したものをまとめた階層です。</p>

      <TranslationsToc />
    </>
  );
}

export const metadata: Metadata = {
  title: '日本語訳集 | 資料集',
  description: '仕様書など、外部資料を日本語訳したものをまとめた階層です。',
};
