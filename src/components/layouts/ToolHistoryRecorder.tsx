'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';

const MAX_HISTORY_LENGTH = 6;
const TOOLS_PATHNAME_PREFIX = '/tools/';

export const isToolPagePathname = (pathname: string) => {
  return pathname.startsWith(TOOLS_PATHNAME_PREFIX) && pathname !== TOOLS_PATHNAME_PREFIX;
};

export const writeHistoryToStorage = (pathname: string) => {
  const history = getLocalStorage('recent-tools') ?? [];
  // TOOLS_LINK_LISTのpathnameは末尾スラッシュなしで定義されているため、trailingSlash設定による付与分を除去して揃える
  const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const existingEntry = history.find((entry) => entry.pathname === normalizedPathname);
  const otherEntries = history.filter((entry) => entry.pathname !== normalizedPathname);
  const nextEntry = {
    pathname: normalizedPathname,
    count: (existingEntry?.count ?? 0) + 1,
    lastAccessedAt: new Date().toISOString(),
  };
  const nextHistory = [nextEntry, ...otherEntries].slice(0, MAX_HISTORY_LENGTH);

  setLocalStorage('recent-tools', nextHistory);
};

export const ToolHistoryRecorder = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (isToolPagePathname(pathname) === false) {
      return;
    }

    writeHistoryToStorage(pathname);
  }, [pathname]);

  return null;
};
