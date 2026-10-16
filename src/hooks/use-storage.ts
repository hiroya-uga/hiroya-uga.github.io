import { getLocalStorage, LocalStorageItems } from '@/utils/local-storage';
import { useMemo, useSyncExternalStore } from 'react';

type Value = LocalStorageItems;
type Key = keyof Value;

const subscribeToStorage = (onStoreChange: () => void) => {
  globalThis.window.addEventListener('storage', onStoreChange);

  return () => {
    globalThis.window.removeEventListener('storage', onStoreChange);
  };
};

const createLocalStorageSnapshotGetter = <T extends Key>(key: T) => {
  let cachedRaw: string | null = null;
  let cachedValue: Value[T] | null = null;

  // localStorageの生の値が変わっていない間はgetSnapshotが同じ参照を返す必要があるためキャッシュを使い回す
  return (): Value[T] | null => {
    const raw = localStorage.getItem(key);

    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = getLocalStorage(key);
    }

    return cachedValue;
  };
};

interface UseLocalStorageOptions<T extends Key> {
  // 渡す場合はcreateLocalStorageSnapshotGetterと同じ契約（値が変わっていなければ同じ参照を返す）を呼び出し側で満たすこと
  getSnapshot?: () => Value[T] | null;
}

export function useLocalStorage<T extends Key>(key: T, options?: UseLocalStorageOptions<T>): Value[T] | null {
  const customGetSnapshot = options?.getSnapshot;

  // keyが変わらない限りgetSnapshotの参照を保ち、内部キャッシュを毎レンダーで作り直さないようにする
  const getSnapshot = useMemo(
    () => customGetSnapshot ?? createLocalStorageSnapshotGetter(key),
    [key, customGetSnapshot],
  );

  return useSyncExternalStore(subscribeToStorage, getSnapshot, () => null);
}
