import { DOMEventWatcherContent } from '@/app/(ja)/(common)/tools/dom-events-watcher/Client';

import { useId } from 'react';

import { Metadata } from 'next';

export default function Page() {
  const id = useId();

  return (
    <>
      <h1>DOM Event Watcher</h1>
      <p className="mb-8">
        次の<a href="#container">スクロール可能な領域</a>
        内のUIを操作すると、JavaScriptがどのようなイベントを受け取るのかを確認できます。
      </p>
      <DOMEventWatcherContent id={id} />;
    </>
  );
}

export const metadata: Metadata = {
  title: 'DOM Event Watcher',
  description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
};
