'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

export const useContrastColors = () => {
  const searchParams = useSearchParams();
  const { defaultForeground = '#333333', defaultBackground = '#ffffff' } = {
    defaultForeground: searchParams.get('f') ?? undefined,
    defaultBackground: searchParams.get('b') ?? undefined,
  };

  const router = useRouter();
  const [foregroundColor, setForegroundColor] = useState(defaultForeground);
  const [backgroundColor, setBackgroundColor] = useState(defaultBackground);

  const setTimeoutIdRef = useRef(-1);

  const debouncedReplace = useCallback(
    (url: string) => {
      clearTimeout(setTimeoutIdRef.current);
      setTimeoutIdRef.current = globalThis.window.setTimeout(() => {
        router.replace(url, { scroll: false });
      }, 300);
    },
    [router],
  );

  useEffect(() => {
    return () => {
      clearTimeout(setTimeoutIdRef.current);
    };
  }, []);

  const updateForegroundColor = (color: string) => {
    debouncedReplace(`?f=${encodeURIComponent(color)}&b=${encodeURIComponent(backgroundColor)}`);
    setForegroundColor(color);
  };

  const updateBackgroundColor = (color: string) => {
    debouncedReplace(`?f=${encodeURIComponent(foregroundColor)}&b=${encodeURIComponent(color)}`);
    setBackgroundColor(color);
  };

  return {
    foregroundColor,
    backgroundColor,
    updateForegroundColor,
    updateBackgroundColor,
  };
};
