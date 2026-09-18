'use client';

import { getTheme } from '@/utils/get-theme';
import { getLocalStorage, setLocalStorage, subscribeToStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useSyncExternalStore } from 'react';

export function useThemeChange() {
  const theme = useSyncExternalStore(
    subscribeToStorage,
    () => {
      const currentTheme = getTheme();
      if (getLocalStorage('theme') === null) {
        setLocalStorage('theme', currentTheme);
      }
      return currentTheme;
    },
    () => 'light' as const,
  );

  const changeTheme = useCallback((newTheme: 'light' | 'dark') => {
    const applyTheme = () => {
      document.documentElement.dataset.theme = newTheme;
      setLocalStorage('theme', newTheme);
      globalThis.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
    };

    if ('startViewTransition' in document === false) {
      applyTheme();
      return;
    }

    document.startViewTransition(applyTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return { theme, changeTheme };
}
