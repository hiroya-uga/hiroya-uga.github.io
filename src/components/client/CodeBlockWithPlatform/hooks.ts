import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useEffect, useState } from 'react';

const PLATFORM_EVENT = 'platform-change';

const dispatchPlatformChange = (platform: string) => {
  globalThis.window.dispatchEvent(new CustomEvent(PLATFORM_EVENT, { detail: platform }));
};

export const usePlatform = (): [string, (next: string) => void] => {
  const [platform, setPlatform] = useState('macOS');

  useEffect(() => {
    const saved = getLocalStorage('platform');

    if (saved === 'macOS' || saved === 'Windows') {
      setPlatform(saved);
    }

    const onPlatformChange = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;

      if (next === 'macOS' || next === 'Windows') {
        setPlatform(next);
      }
    };

    globalThis.window.addEventListener(PLATFORM_EVENT, onPlatformChange);
    return () => globalThis.window.removeEventListener(PLATFORM_EVENT, onPlatformChange);
  }, []);

  const handleChange = (platform: string) => {
    setPlatform(platform);
    setLocalStorage('platform', platform);
    dispatchPlatformChange(platform);
  };

  return [platform, handleChange];
};
