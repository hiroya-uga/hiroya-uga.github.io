import { SimpleDescriptionList } from '@/components/List';
import { PageTitle } from '@/components/structures/PageTitle';

import { Metadata } from 'next';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <PageTitle title="日本語訳集">
        <p>仕様書など、外部資料を日本語訳したものをまとめた階層です。</p>
      </PageTitle>

      <SimpleDescriptionList
        list={[
          {
            key: `Images Tutorial`,
            title: (
              <>
                <Link href="/documents/translations/w3c/wai/tutorials/images/">Images Tutorial</Link>
              </>
            ),
            description: 'WAI(W3C)による代替テキストに関するチュートリアルの日本語訳。',
          },
          {
            key: `PaulJAdam's Modern Web Accessibility Demos`,
            title: (
              <>
                <Link href="/documents/translations/pauljadam-modern-web-a11y-demos/">
                  PaulJAdam's Modern Web Accessibility Demos
                </Link>
              </>
            ),
            description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
          },
        ]}
      />
    </>
  );
}

export const metadata: Metadata = {
  title: '日本語訳集 | 資料集',
  description: '仕様書など、外部資料を日本語訳したものをまとめた階層です。',
};
