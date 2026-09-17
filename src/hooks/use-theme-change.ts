'use client';

import { getTheme } from '@/utils/get-theme';
import { getLocalStorage, setLocalStorage, subscribeToStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

const { window } = globalThis;
const DURATION = 300;

export function useThemeChange() {
  const styleElement = useMemo(() => {
    if (window === undefined) {
      return null;
    }

    const style = document.createElement('style');
    const durationAndTimingFunction = `
      transition-duration: ${DURATION}ms!important;
      transition-timing-function: ease-out!important;
    `;

    style.textContent = `
      body :where(a) {
        transition-property: color !important;
        ${durationAndTimingFunction}
      }
      body, body :where(p,button,h1,h2,h3,h4,h5,h6,figure,[class*="bg-"],[class*="shadow-"]) {
        transition-property: color, background-color, border-color, box-shadow, text-decoration-color !important;
        ${durationAndTimingFunction}
      }
      body [class*=":invert"] {
        transition-property: filter !important;
        ${durationAndTimingFunction}
      }
      body :where(g,path,polygon) {
        transition-property:  fill, stroke !important;
        ${durationAndTimingFunction}
      }
    `;

    return style;
  }, []);
  const setTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | number>(-1);

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

  const changeTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      if (styleElement instanceof HTMLStyleElement) {
        clearTimeout(setTimeoutIdRef.current);
        document.head.appendChild(styleElement);
        setTimeoutIdRef.current = globalThis.setTimeout(() => {
          styleElement.remove();
        }, DURATION);
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
