import { SortVisualizerContent } from '@/app/(ja)/(wide-content)/tools/sort-visualizer/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { ShareSection } from '@/components/structures/ShareSection';
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
      <ShareSection />
    </>
  );
}
