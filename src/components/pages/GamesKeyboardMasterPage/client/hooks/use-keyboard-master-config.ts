'use client';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useState } from 'react';

const SAVEDATA_KEY = 'savedata-keyboard-master';

export interface KeyboardMasterFlags {
  timeLimit: boolean;
  animation: boolean;
  random: boolean;
}

export interface KeyboardMasterConfig {
  flags: KeyboardMasterFlags;
}

const DEFAULT_CONFIG: KeyboardMasterConfig = {
  flags: {
    timeLimit: false,
    animation: true,
    random: false,
  },
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
      flags: {
        timeLimit: saveData?.flags?.timeLimit ?? DEFAULT_CONFIG.flags.timeLimit,
        animation: saveData?.flags?.animation ?? DEFAULT_CONFIG.flags.animation,
        random: saveData?.flags?.random ?? DEFAULT_CONFIG.flags.random,
      },
    });
  }, []);

  const updateFlags = useCallback(
    (patch: Partial<KeyboardMasterFlags>) => {
      const next = { ...config, flags: { ...config.flags, ...patch } };

      setConfig(next);
      setLocalStorage(SAVEDATA_KEY, next);
    },
    [config],
  );

  return { config, updateFlags };
};
