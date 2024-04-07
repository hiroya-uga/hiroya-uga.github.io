import { TouchEventTouchesContent } from '@/app/(ja)/(common)/tools/touch-event-touches/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

export const metadata: Metadata = {
  title: 'TouchEvent.touches Playground',
  description: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
  twitter: {
    card: 'summary_large_image',
    title: 'TouchEvent.touches Playground',
    description: 'デバイスのタッチ操作が利用可能か、何本の指でタッチできるのかをテストできます。',
  },
};

export default function Page() {
  return (
    <>
      <PageTitle title={metadata.title}>
        <p>{metadata.description}</p>
      </PageTitle>
      <p>Startボタンを押した後に画面をタッチすると指の座標が表示されます。</p>
      <p className="mb-8">テストを終了する場合はページを再読み込みするか、Stopボタンを押してください。</p>
      <TouchEventTouchesContent />
    </>
  );
}
