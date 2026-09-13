'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { PageTitle } from '@/components/structures/PageTitle';
import { RunButton } from '@/components/ui/buttons/RunButton';
import { Toast } from '@/components/ui/dialogs/Toast';
import { Switch } from '@/components/ui/forms';
import { getLocalStorage, setLocalStorage, subscribeToStorage } from '@/utils/local-storage';

interface Props {
  pageTitle: string;
  description: string;
}

export const ConfigPage = ({ pageTitle, description }: Props) => {
  const [toastMessage, setToastMessage] = useState('');
  const syncedHistoryEnabled = useSyncExternalStore(
    subscribeToStorage,
    () => getLocalStorage('home')?.['recent-tools-section-is-enabled'] ?? false,
    () => false,
  );
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(syncedHistoryEnabled);

  useEffect(() => {
    setIsHistoryEnabled(syncedHistoryEnabled);
  }, [syncedHistoryEnabled]);

  return (
    <>
      <PageTitle title={pageTitle} description={description} />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-secondary max-w-400px p-32PX mx-auto rounded-md"
        noValidate
      >
        <p>
          <Switch
            label="ツールページの閲覧履歴を利用する"
            checked={isHistoryEnabled}
            onChange={({ currentTarget }) => {
              setIsHistoryEnabled(currentTarget.checked);
            }}
          />
        </p>

        <p className="mt-12">
          <RunButton
            type="submit"
            onClick={() => {
              setLocalStorage('home', {
                ...getLocalStorage('home'),
                'recent-tools-section-is-enabled': isHistoryEnabled,
              });
              setToastMessage('保存しました。');
            }}
          >
            保存
          </RunButton>
        </p>
      </form>

      <Toast message={toastMessage} setMessage={setToastMessage} duration={2000} />
    </>
  );
};
