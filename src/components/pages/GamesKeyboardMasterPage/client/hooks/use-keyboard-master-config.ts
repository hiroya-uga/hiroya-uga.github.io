'use client';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useState } from 'react';

const SAVEDATA_KEY = 'savedata-keyboard-master';

export interface KeyboardMasterConfig {
  shouldDisableTimeLimit: boolean;
  shouldDisableAnimation: boolean;
}

const DEFAULT_CONFIG: KeyboardMasterConfig = {
  shouldDisableTimeLimit: false,
  shouldDisableAnimation: false,
};

/**
 * ゲーム設定を保持する。
 * localStorageは保存のたびに全体を書き換えるため、常に全項目を書き出す。
 */
export const useKeyboardMasterConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    const saveData = getLocalStorage(SAVEDATA_KEY);

    setConfig({
      shouldDisableTimeLimit: saveData?.shouldDisableTimeLimit ?? DEFAULT_CONFIG.shouldDisableTimeLimit,
      shouldDisableAnimation: saveData?.shouldDisableAnimation ?? DEFAULT_CONFIG.shouldDisableAnimation,
    });
  }, []);

  const updateConfig = useCallback(
    (patch: Partial<KeyboardMasterConfig>) => {
      const next = { ...config, ...patch };

      setConfig(next);
      setLocalStorage(SAVEDATA_KEY, next);
    },
    [config],
  );

  return { config, updateConfig };
};
