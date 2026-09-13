'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { Confirm } from '@/components/ui/dialogs/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';
import { getMetadata } from '@/utils/get-metadata';
import { getLocalStorage, LocalStorageItems, setLocalStorage } from '@/utils/local-storage';
import Link from 'next/link';

const MAX_HISTORY_LENGTH = 6;
const TOOLS_PATHNAME_PREFIX = '/tools/';
const USAGE_COUNT_TO_PROMPT_HISTORY_ENABLE = 3;

export const isToolPagePathname = (pathname: string) => {
  return pathname.startsWith(TOOLS_PATHNAME_PREFIX) && pathname !== TOOLS_PATHNAME_PREFIX;
};

export const addHistoryToStorage = (pathname: string) => {
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

  return nextHistory;
};

export const getUsageCount = (history: LocalStorageItems['recent-tools'] | null) => {
  return (history ?? []).reduce((sum, entry) => sum + entry.count, 0);
};

export const ToolHistoryRecorder = () => {
  const pathname = usePathname();
  const { confirmData, setConfirmData, closeConfirm } = useConfirm();

  useEffect(() => {
    if (isToolPagePathname(pathname) === false) {
      return;
    }

    const history = addHistoryToStorage(pathname);
    const usageCount = getUsageCount(history);
    const home = getLocalStorage('home');
    const shown = getLocalStorage('shown');
    const shouldPromptHistoryEnable =
      USAGE_COUNT_TO_PROMPT_HISTORY_ENABLE <= usageCount &&
      home?.['recent-tools-section-is-enabled'] !== true &&
      shown?.['recent-tools-section-prompt'] !== true;

    if (shouldPromptHistoryEnable === false) {
      return;
    }

    const setUserConfig = (isEnabled: boolean) => {
      setLocalStorage('home', {
        ...home,
        'recent-tools-section-is-enabled': isEnabled,
      });
      setLocalStorage('shown', {
        ...shown,
        'recent-tools-section-prompt': true,
      });
    };

    setTimeout(() => {
      setConfirmData({
        message: 'ツールの閲覧履歴をトップページに表示しますか？',
        children: (
          <>
            <p>よく使うツールをトップページの履歴からすぐに開けるようになります。</p>
            <p>
              この機能はページ下部の
              <Link
                href="/config/"
                onClick={() => {
                  setUserConfig(false);
                  closeConfirm();
                }}
              >
                {getMetadata('/config').pageTitle}
              </Link>
              から有効・無効を切り替えられます。
            </p>
          </>
        ),
        yesLabel: '利用する',
        noLabel: '利用しない',
        yes: () => {
          setUserConfig(true);
        },
        no: () => {
          setUserConfig(false);
        },
      });
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <Confirm confirm={confirmData} setConfirmData={setConfirmData} />;
};
