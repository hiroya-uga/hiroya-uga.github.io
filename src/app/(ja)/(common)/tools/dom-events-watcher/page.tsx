import { DOMEventWatcherContent } from '@/app/(ja)/(common)/tools/dom-events-watcher/Client';

import { useId } from 'react';

import { Metadata } from 'next';

export default function Page() {
  const id = useId();

  return (
    <>
      <h1>DOM Event Watcher</h1>
      <DOMEventWatcherContent id={id} />
    </>
  );
}

export const metadata: Metadata = {
  title: 'DOM Event Watcher',
  description: 'JavaScriptがどのようなイベントを受け取るのかを確認できます。',
};
