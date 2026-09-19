'use client';

import { useLocalStorage } from '@/hooks/use-storage';
import { getTheme } from '@/utils/get-theme';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect } from 'react';

export function useThemeChange() {
  const getSnapshot = useCallback(() => {
    const currentTheme = getTheme();
    if (getLocalStorage('theme') === null) {
      setLocalStorage('theme', currentTheme);
    }
    return currentTheme;
  }, []);

  const theme = useLocalStorage('theme', { getSnapshot, defaultValue: 'light' });

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
