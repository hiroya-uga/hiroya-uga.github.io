'use client';

import { useEffect, useState } from 'react';

import { PageTitle } from '@/components/structures/PageTitle';
import { ClearButton } from '@/components/ui/buttons/ClearButton';
import { RunButton } from '@/components/ui/buttons/RunButton';
import { Confirm } from '@/components/ui/dialogs/Confirm/Confirm';
import { useConfirm } from '@/components/ui/dialogs/Confirm/hooks';
import { Toast } from '@/components/ui/dialogs/Toast';
import { Switch } from '@/components/ui/forms';
import { LoadingIcon } from '@/components/ui/media/LoadingIcon';
import { useLocalStorage } from '@/hooks/use-storage';
import { applyCookieConsent } from '@/utils/cookie-consent';
import { getLocalStorage, LocalStorageItems, removeLocalStorage, setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';

type ResetTarget = {
  [K in keyof LocalStorageItems]: LocalStorageItems[K] extends object
    ? { key: K; label: string; targetKeys?: (keyof LocalStorageItems[K])[] }
    : { key: K; label: string; targetKeys?: never };
}[keyof LocalStorageItems];

const RESET_TARGET_GROUPS: { groupLabel: string; items: ResetTarget[] }[] = [
  {
    groupLabel: 'ツール',
    items: [
      { key: 'recent-tools', label: 'ツールページの閲覧履歴' },
      { key: 'savedata-focal-length-checker', label: '焦点距離チェッカー' },
    ],
  },
  {
    groupLabel: 'ゲーム',
    items: [{ key: 'savedata-sudoku-game', label: '無限数独（ナンプレ）' }],
  },
  {
    groupLabel: 'その他',
    items: [
      { key: 'home', label: 'トップページの演出スキップ', targetKeys: ['power-section-viewed-at'] },
      { key: 'achievement', label: '実績の解除状況' },
    ],
  },
];

const hasExistingRecord = ({ key, targetKeys }: ResetTarget): boolean => {
  const value = getLocalStorage(key);
  if (value === null) {
    return false;
  }

  if (targetKeys && 0 < targetKeys.length) {
    const record = value as Record<PropertyKey, unknown>;
    return targetKeys.some((targetKey) => record[targetKey] !== undefined);
  }

  return true;
};

const getExistingKeys = (): Set<keyof LocalStorageItems> => {
  const allItems = RESET_TARGET_GROUPS.flatMap(({ items }) => items);
  return new Set(allItems.filter(hasExistingRecord).map(({ key }) => key));
};

const updateStorage = <K extends keyof LocalStorageItems>({
  key,
  targetKeys,
}: {
  key: K;
  targetKeys: PropertyKey[];
}) => {
  const updated = { ...(getLocalStorage(key) as object) } as Record<PropertyKey, unknown>;
  targetKeys.forEach((targetKey) => {
    delete updated[targetKey];
  });
  setLocalStorage(key, updated as unknown as LocalStorageItems[K]);
};

interface Props {
  pageTitle: string;
  description: string;
}

export const ConfigPage = ({ pageTitle, description }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { confirmData, setConfirmData } = useConfirm();
  const [existingKeys, setExistingKeys] = useState<Set<keyof LocalStorageItems>>(() => new Set());

  useEffect(() => {
    setExistingKeys(getExistingKeys());
    setIsReady(true);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setExistingKeys(getExistingKeys());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const home = useLocalStorage('home');
  const syncedHistoryEnabled = home?.['recent-tools-section-is-enabled'] ?? false;
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(syncedHistoryEnabled);

  const cookieConsent = useLocalStorage('cookie-consent');
  const syncedCookieConsentEnabled = cookieConsent === 'accepted';
  const [isCookieConsentEnabled, setIsCookieConsentEnabled] = useState(syncedCookieConsentEnabled);

  useEffect(() => {
    setIsHistoryEnabled(syncedHistoryEnabled);
    setIsCookieConsentEnabled(syncedCookieConsentEnabled);
  }, [syncedHistoryEnabled, syncedCookieConsentEnabled]);

  const handleClearButtonClick = ({
    key,
    label,
    targetKeys,
  }: {
    key: keyof LocalStorageItems;
    label: string;
    targetKeys?: PropertyKey[];
  }) => {
    setConfirmData({
      message: `「${label}」を初期化しますか？`,
      yes: () => {
        if (targetKeys && 0 < targetKeys.length) {
          updateStorage({ key, targetKeys });
          setToastMessage('初期化しました。');
          setExistingKeys(getExistingKeys());
          return;
        }

        const isSucceeded = removeLocalStorage(key);
        setToastMessage(isSucceeded ? '初期化しました。' : '初期化に失敗しました。');
        setExistingKeys(getExistingKeys());
      },
      no: () => {},
    });
  };

  return (
    <>
      <PageTitle title={pageTitle} description={description} />

      <div className="relative">
        <p className={clsx(['absolute inset-0 m-auto size-fit', isReady && 'hidden'])}>
          <LoadingIcon />
        </p>
        <div className={clsx(['w800:grid-cols-2 grid gap-12', isReady ? 'animate-fade-in' : 'invisible'])}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-secondary pt-32PX pb-24PX px-16PX w640:px-32PX rounded-md"
            noValidate
          >
            <ul className="border-primary divide-primary divide-y rounded-md border">
              <li className="p-16PX">
                <Switch
                  label="Cookie（アクセス解析）の利用に同意する"
                  checked={isCookieConsentEnabled}
                  onChange={({ currentTarget }) => {
                    setIsCookieConsentEnabled(currentTarget.checked);
                  }}
                />
              </li>

              <li className="p-16PX">
                <Switch
                  label="ツールページの閲覧履歴を利用する"
                  checked={isHistoryEnabled}
                  onChange={({ currentTarget }) => {
                    setIsHistoryEnabled(currentTarget.checked);
                  }}
                />
              </li>
            </ul>

            <p className="mt-6">
              <RunButton
                type="submit"
                onClick={() => {
                  setLocalStorage('home', {
                    ...getLocalStorage('home'),
                    'recent-tools-section-is-enabled': isHistoryEnabled,
                  });
                  applyCookieConsent(isCookieConsentEnabled ? 'accepted' : 'rejected');
                  setToastMessage('保存しました。');
                }}
              >
                保存
              </RunButton>
            </p>
          </form>

          <div className="bg-secondary pt-24PX pb-32PX px-16PX w640:px-32PX rounded-md">
            <h2 className="mb-6 font-bold">保存データの初期化</h2>

            <div className="space-y-6">
              {RESET_TARGET_GROUPS.map(({ groupLabel, items }) => {
                const existingItems = items.filter(({ key }) => existingKeys.has(key));

                if (existingItems.length === 0) {
                  return null;
                }

                return (
                  <section key={groupLabel}>
                    <h3 className="mb-2 text-sm font-bold">{groupLabel}</h3>
                    <ul className="border-primary divide-primary divide-y rounded-md border">
                      {existingItems.map(({ key, label, targetKeys }) => (
                        <li key={key} className="p-16PX flex items-center justify-between gap-4">
                          <span className="text-sm">{label}</span>
                          <ClearButton
                            size="small"
                            onClick={() =>
                              handleClearButtonClick({
                                key,
                                label,
                                targetKeys,
                              })
                            }
                          >
                            初期化
                          </ClearButton>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} setMessage={setToastMessage} duration={2000} />
      <Confirm confirm={confirmData} setConfirmData={setConfirmData} />
    </>
  );
};
