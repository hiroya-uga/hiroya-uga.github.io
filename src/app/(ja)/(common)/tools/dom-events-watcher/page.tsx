import { DOMEventWatcherContent } from '@/app/(ja)/(common)/tools/dom-events-watcher/Client';
import { PageTitle } from '@/components/structures/PageTitle';
import { Metadata } from '@/types/seo';

import { useId } from 'react';

export const metadata: Metadata = {
  title: 'Playground:DOM Event Watcher',
  description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
  twitter: {
    card: 'summary_large_image',
    title: 'Playground:DOM Event Watcher',
    description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
  },
};

export default function Page() {
  const id = useId();

  return (
    <>
      <PageTitle title={metadata.title}>
        <p className="mb-6">
          このページの
          <a href="#container" id={`${id}-title`}>
            いろんなイベントを受け取るフォーカス・スクロール可能なform要素
          </a>
          内のUIを操作すると、JavaScriptがどのようなイベントを受け取るのかを確認できます。
        </p>

        <p>
          イベントハンドラを持っている要素はform要素のみですが、一部のイベントによってはバブリングしないため直接イベントを受け取る要素にハンドラを登録しています。
        </p>
      </PageTitle>
      <DOMEventWatcherContent id={id} />
    </>
  );
}
