'use client';

import { getTheme } from '@/utils/get-theme';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

const { window } = globalThis;

export function useThemeChange() {
  const styleElement = useMemo(() => {
    if (window === undefined) {
      return null;
    }

    const style = document.createElement('style');

    style.textContent = `
      * {
        transition-property: color, background-color, border-color, box-shadow, text-decoration-color, fill, stroke, filter !important;
        transition-duration: 0.3s!important;
        transition-timing-function: ease-out!important;
      }
    `;

    return style;
  }, []);
  const setTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | number>(-1);

  const theme = useSyncExternalStore(
    (callback) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'theme') {
          callback();
        }
      };

      globalThis.addEventListener('storage', handleStorageChange);

      return () => {
        globalThis.removeEventListener('storage', handleStorageChange);
      };
    },
    () => {
      const currentTheme = getTheme();
      if (getLocalStorage('theme') === null) {
        setLocalStorage('theme', currentTheme);
      }
      return currentTheme;
    },
    () => 'light' as const,
  );

  const changeTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      if (styleElement instanceof HTMLStyleElement) {
        clearTimeout(setTimeoutIdRef.current);
        document.head.appendChild(styleElement);
        setTimeoutIdRef.current = globalThis.setTimeout(() => {
          styleElement.remove();
        }, 300);
      }

      document.documentElement.dataset.theme = newTheme;
      setLocalStorage('theme', newTheme);
      globalThis.dispatchEvent(new StorageEvent('storage', { key: 'theme' }));
    },
    [styleElement],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return { theme, changeTheme };
}
