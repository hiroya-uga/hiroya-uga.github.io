import { DOMEventWatcherContent } from '@/app/(ja)/(common)/tools/dom-events-watcher/Client';

import { useId } from 'react';

import { Metadata } from 'next';

export default function Page() {
  const id = useId();

  return (
    <>
      <h1>DOM Event Watcher</h1>
      <p className="mb-24">
        テキストフィールドなどを含む、次のスクロール可能な領域内のUIを操作すると、JavaScriptがどのようなイベントを受け取るのかを確認できます。
      </p>
      <DOMEventWatcherContent id={id} />;
    </>
  );
}

export const metadata: Metadata = {
  title: 'DOM Event Watcher',
  description: 'どのような操作を行うと、JavaScriptがどのようなイベントを受け取るのかを確認できます。',
};
