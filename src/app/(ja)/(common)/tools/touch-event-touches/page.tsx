import { TouchEventTouchesContent } from '@/app/(ja)/(common)/tools/touch-event-touches/Client';
import { PageTitle } from '@/components/structures/PageTitle';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/tools/touch-event-touches');

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.pageTitle}>
        <p>{metadata.description}</p>
      </PageTitle>
      <p>Startボタンを押した後に画面をタッチすると指の座標が表示されます。</p>
      <p className="mb-8">テストを終了する場合はページを再読み込みするか、Stopボタンを押してください。</p>
      <TouchEventTouchesContent />
    </>
  );
}
