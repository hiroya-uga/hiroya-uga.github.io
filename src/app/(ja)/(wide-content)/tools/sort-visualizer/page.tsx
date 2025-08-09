import { SortVisualizerContent } from '@/app/(ja)/(wide-content)/tools/sort-visualizer/Client';
import { TweetLink } from '@/components/Clickable/TweetLink';
import { PageTitle } from '@/components/structures/PageTitle';
import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/tools/sort-visualizer');

export default function Page() {
  return (
    <>
      <PageTitle {...metadata}>
        <p className="flex gap-1 text-sm">
          <span>※</span>
          <span>
            これらのソートアルゴリズムおよびアニメーションは、正確性を保証するものではありません。
            <span className="block">可視化にともない、本来のパフォーマンスが発揮されない場合があります。</span>
          </span>
        </p>
      </PageTitle>
      <SortVisualizerContent />
      <p className="mt-share-buttons mx-auto grid justify-end">
        <TweetLink hashtags={['SlackBot']} />
      </p>
    </>
  );
}
