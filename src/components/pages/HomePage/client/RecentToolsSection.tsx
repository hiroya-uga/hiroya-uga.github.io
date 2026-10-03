'use client';

import { useMemo } from 'react';

import { ToolCard } from '@/components/ui/card/ToolCard';
import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { ALL_TOOLS_LINK_LIST } from '@/constants/link-list';
import { useLocalStorage } from '@/hooks/use-storage';
import { getMetadata } from '@/utils/get-metadata';
import type { LocalStorageItems } from '@/utils/local-storage';
import Link from 'next/link';

const emptyHistoryList: typeof ALL_TOOLS_LINK_LIST = [];

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

export const RecentToolsSection = () => {
  const history = useLocalStorage('recent-tools');
  const home = useLocalStorage('home');
  const historyList = useMemo(() => resolveHistoryList(history, home), [history, home]);

  if (historyList.length === 0) {
    return null;
  }

  return (
    <div className="max-w-content mx-auto">
      <h2>Recent Tools</h2>

      <div className="mt-5">
        <dl className="w640:px-1 w640:grid-cols-2 w800:grid-cols-3 w640:gap-4 grid grid-cols-1 gap-3">
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

        <p className="mr-6PX ml-auto mt-4 w-fit">
          <Link
            href="/tools"
            className="gap-x-6PX pointer-fine:gap-x-4PX group grid grid-cols-[1fr_12px] items-center text-sm text-inherit no-underline hover:underline"
          >
            <span>ツールをすべて見る</span>
            <span className="size-12PX group-hover:translate-x-2PX relative transition-transform [--x-fill:currentColor]">
              <SvgIcon name="arrow2-right" alt="" />
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};
