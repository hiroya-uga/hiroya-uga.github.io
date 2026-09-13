'use client';

import { useSyncExternalStore } from 'react';

import { ToolCard } from '@/components/ui/card/ToolCard';
import { ALL_TOOLS_LINK_LIST } from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';
import { getLocalStorage, type LocalStorageItems, subscribeToStorage } from '@/utils/local-storage';

const emptyHistoryList: typeof ALL_TOOLS_LINK_LIST = [];

const historyListCache: {
  raw: string | null;
  homeRaw: string | null;
  list: typeof ALL_TOOLS_LINK_LIST;
} = {
  raw: null,
  homeRaw: null,
  list: emptyHistoryList,
};

export const resolveHistoryList = (
  history: LocalStorageItems['recent-tools'] | null,
  home: LocalStorageItems['home'] | null,
): typeof ALL_TOOLS_LINK_LIST => {
  if (home?.['recent-tools-section-is-enabled'] !== true) {
    return emptyHistoryList;
  }

  return (history ?? [])
    .map((entry) => ALL_TOOLS_LINK_LIST.find((item) => item.pathname === entry.pathname))
    .filter((item) => item !== undefined);
};

const getHistoryList = (): typeof ALL_TOOLS_LINK_LIST => {
  if (globalThis.window === undefined) {
    return emptyHistoryList;
  }

  const { raw: historyRaw, parsed: history } = getLocalStorage('recent-tools', { withRaw: true });
  const { raw: homeRaw, parsed: home } = getLocalStorage('home', { withRaw: true });

  // localStorageの生の値が変わっていない間はgetSnapshotが同じ参照を返す必要があるためキャッシュを使い回す
  const isCacheValid = historyRaw === historyListCache.raw && homeRaw === historyListCache.homeRaw;

  if (isCacheValid) {
    return historyListCache.list;
  }

  historyListCache.raw = historyRaw;
  historyListCache.homeRaw = homeRaw;
  historyListCache.list = resolveHistoryList(history, home);

  return historyListCache.list;
};

export const RecentToolsSection = () => {
  const historyList = useSyncExternalStore(
    subscribeToStorage,
    () => getHistoryList(),
    () => emptyHistoryList,
  );

  if (historyList.length === 0) {
    return null;
  }

  return (
    <div className="max-w-content mx-auto">
      <h2>Recent Tools</h2>

      <div className="mt-5">
        <dl className="w640:px-1 w640:grid-cols-2 w800:grid-cols-3 grid grid-cols-1 gap-4">
          {historyList.map((item) => {
            const metadata = getMetadata(item.pathname);

            return (
              <ToolCard
                key={metadata.pageTitle}
                pageTitle={metadata.pageTitle}
                pathname={item.pathname}
                description={metadata.description.split('\n')}
                truncate
              />
            );
          })}
        </dl>
      </div>
    </div>
  );
};
