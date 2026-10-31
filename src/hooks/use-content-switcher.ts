import { getLocalStorage, LOCAL_STORAGE_KEYS, setLocalStorage } from '@/utils/local-storage';
import { useEffect, useState } from 'react';

type SwitcherType = 'platform' | 'language';

const PLATFORMS = ['macOS', 'Windows'];

type Return = [string, (_: string) => void];

export function useContentSwitcher(type: 'platform', keys?: string[]): Return;
export function useContentSwitcher(type: 'language', keys: string[]): Return;
export function useContentSwitcher(type: SwitcherType, keys: string[]): Return;
export function useContentSwitcher(type: SwitcherType = 'platform', keys: string[] = PLATFORMS) {
  const storageKey = type === 'platform' ? LOCAL_STORAGE_KEYS.PLATFORM : LOCAL_STORAGE_KEYS.CODE_LANGUAGE;

  const [selected, setSelected] = useState(keys[0]);

  // 配列リテラルを渡されても effect を再実行させない
  const keysId = keys.join('\n');
  const eventName = `${type}-change`;

  useEffect(() => {
    const available = keysId.split('\n');
    const saved = getLocalStorage(storageKey);

    if (saved !== null && available.includes(saved)) {
      setSelected(saved);
    }

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;

      if (available.includes(next)) {
        setSelected(next);
      }
    };

    globalThis.window.addEventListener(eventName, onChange);
    return () => globalThis.window.removeEventListener(eventName, onChange);
  }, [keysId, storageKey, eventName]);

  const handleChange = (next: string) => {
    setSelected(next);
    setLocalStorage(storageKey, next);
    globalThis.window.dispatchEvent(new CustomEvent(eventName, { detail: next }));
  };

  return [selected, handleChange];
}
