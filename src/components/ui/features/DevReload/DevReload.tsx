'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

// ポート番号を変える場合は scripts/watch-media.mjs の RELOAD_PORT も合わせて変更する
const RELOAD_EVENT_SOURCE_URL = 'http://localhost:4201/events';

export const DevReload = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const eventSource = new EventSource(RELOAD_EVENT_SOURCE_URL);
    eventSource.onmessage = () => router.refresh();

    return () => eventSource.close();
  }, [router]);

  return null;
};
