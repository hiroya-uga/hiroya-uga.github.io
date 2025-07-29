import { RenderTextInReactPlaygroundContent } from '@/app/(ja)/(common)/tools/render-text-in-react/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';
import Link from 'next/link';

export const metadata = getMetadata('/tools/render-text-in-react');

export default function Page() {
  return (
    <>
      <PageTitle {...metadata}>
        <p>iOS 18 Safari + VoiceOverで読み上げが変わる様子が確認できます。</p>
        <p>
          参考記事：
          <Link href="/articles/tech-blog/2025/07-27-react-text-node/">
            Reactのテキストは記述の仕方で読み上げが変わってしまう件について
          </Link>
        </p>
      </PageTitle>

      <RenderTextInReactPlaygroundContent />

      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink />
      </p>
    </>
  );
}
