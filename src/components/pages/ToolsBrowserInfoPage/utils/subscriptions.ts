import { createEmptyPermissions } from './captures';
import { PERMISSION_NAMES } from './constants';
import type { BatteryState, NavigatorWithExtras, PermissionsSnapshot } from './types';

const BATTERY_EVENTS = ['chargingchange', 'levelchange', 'chargingtimechange', 'dischargingtimechange'] as const;

const getNavigator = (): NavigatorWithExtras => navigator as NavigatorWithExtras;

export const subscribeConnectionChange = (callback: () => void, signal: AbortSignal): void => {
  getNavigator().connection?.addEventListener('change', callback, { signal });
};

/**
 * window.screenX/Y はネイティブな変更通知がないので 250ms 間隔でポーリングするしかない。
 * バックグラウンドタブでは止めて CPU 消費を抑える。
 */
export const subscribeWindowPosition = (callback: () => void, signal: AbortSignal): void => {
  let lastScreenX = window.screenX;
  let lastScreenY = window.screenY;
  let intervalId: number | undefined;

  const start = () => {
    if (intervalId !== undefined) {
      return;
    }
    lastScreenX = window.screenX;
    lastScreenY = window.screenY;
    intervalId = window.setInterval(() => {
      if (window.screenX !== lastScreenX || window.screenY !== lastScreenY) {
        lastScreenX = window.screenX;
        lastScreenY = window.screenY;
        callback();
      }
    }, 250);
  };

  const stop = () => {
    if (intervalId === undefined) {
      return;
    }
    window.clearInterval(intervalId);
    intervalId = undefined;
  };

  if (document.hidden === false) {
    start();
  }
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    },
    { signal },
  );
  signal.addEventListener('abort', stop);
};

export const subscribeBattery = (callback: (state: BatteryState) => void, signal: AbortSignal): void => {
  const nav = getNavigator();
  if (nav.getBattery === undefined) {
    callback({ kind: 'unsupported' });
    return;
  }
  // `this` を保つため必ず navigator 経由で呼ぶ（分割代入すると Illegal invocation になる）
  nav
    .getBattery()
    .then((battery) => {
      if (signal.aborted) {
        return;
      }
      const emit = () =>
        callback({
          kind: 'ready',
          snapshot: {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          },
        });
      emit();
      BATTERY_EVENTS.forEach((event) => battery.addEventListener(event, emit, { signal }));
    })
    .catch(() => {
      if (signal.aborted === false) {
        callback({ kind: 'unsupported' });
      }
    });
};

export const subscribeStorageChange = (callback: () => void, signal: AbortSignal): void => {
  window.addEventListener('storage', callback, { signal });
};

export const subscribeMediaDevicesChange = (callback: () => void, signal: AbortSignal): void => {
  navigator.mediaDevices?.addEventListener('devicechange', callback, { signal });
};

export const subscribePermissions = async (
  callback: (snapshot: PermissionsSnapshot) => void,
  signal: AbortSignal,
): Promise<void> => {
  const snapshot = createEmptyPermissions();
  if (navigator.permissions === undefined) {
    callback(snapshot);
    return;
  }
  await Promise.all(
    PERMISSION_NAMES.map(async (name) => {
      try {
        const status = await navigator.permissions.query({ name } as unknown as { name: globalThis.PermissionName });
        if (signal.aborted) {
          return;
        }
        snapshot[name] = status.state;
        status.addEventListener(
          'change',
          () => {
            snapshot[name] = status.state;
            callback({ ...snapshot });
          },
          { signal },
        );
      } catch {
        // 未対応の permission name は 'unsupported' のまま
      }
    }),
  );
  if (signal.aborted === false) {
    callback({ ...snapshot });
  }
};
