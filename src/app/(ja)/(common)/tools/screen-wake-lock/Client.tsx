'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import { RunButton } from '@/components/Clickable';
import { LoadingIcon } from '@/components/Icons';

export function KeepAwakeClient() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setIsSupported('wakeLock' in navigator);
    });
  }, []);

  const addReleaseListener = useCallback((sentinel: WakeLockSentinel) => {
    sentinel.addEventListener(
      'release',
      () => {
        wakeLockRef.current = null;
        setIsActive(false);
        console.log('wow');
      },
      { once: true },
    );
  }, []);

  const start = useCallback(async () => {
    setIsError(false);
    setIsEnabled(true);

    if (wakeLockRef.current) {
      return;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      addReleaseListener(wakeLockRef.current);
      setIsActive(true);
    } catch {
      wakeLockRef.current = null;
      setIsActive(false);
      setIsError(true);
    }
  }, [addReleaseListener]);

  const stop = useCallback(async () => {
    setIsEnabled(false);

    try {
      await wakeLockRef.current?.release();
    } finally {
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    if (isSupported !== true) {
      return;
    }

    const handleVisibilityChange = () => {
      if (isEnabled === false || document.visibilityState !== 'visible') {
        return;
      }

      void (async () => {
        if (wakeLockRef.current) return;

        try {
          const sentinel = await navigator.wakeLock.request('screen');
          wakeLockRef.current = sentinel;
          addReleaseListener(sentinel);
          setIsError(false);
          setIsActive(true);
        } catch {
          setIsError(true);
        }
      })();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [addReleaseListener, isEnabled, isSupported]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  if (isSupported === null) {
    return (
      <p className="grid aspect-video place-items-center">
        <LoadingIcon />
      </p>
    );
  }

  if (isSupported === false) {
    return (
      <p className="text-alert text-center text-sm">
        <strong>ご利用のブラウザは Screen Wake Lock API に対応していません。</strong>
      </p>
    );
  }

  return (
    <>
      <div
        className={clsx(
          'mx-auto mb-6 grid size-28 place-items-center rounded-full transition-[box-shadow,background-color] duration-300',
          isActive
            ? 'bg-white shadow-[0_0_24px_4px_var(--color-orange-400)]'
            : 'bg-secondary border-primary border border-solid',
        )}
      >
        <p
          role="img"
          className={clsx(
            'transition-[transform_opacity_font-size] duration-300',
            isActive ? 'text-6xl' : 'rotate-20 text-5xl opacity-50',
          )}
        >
          ☀️
        </p>
      </div>

      {isError && (
        <p role="alert" className="text-alert text-center text-sm">
          <strong className="block">スリープ防止に失敗しました。</strong>
          バッテリー残量が少ないか、省電力モードになっているなどの可能性があります。ブラウザの設定を確認してください。
        </p>
      )}

      <p className="mb-8 text-center text-lg font-bold" aria-live="assertive">
        スリープ防止：{isActive ? '実行中' : '停止中'}
      </p>

      <p>
        <RunButton type="button" onClick={isActive ? stop : start}>
          {isActive ? 'スリープ防止を解除する' : 'スリープ防止を開始する'}
        </RunButton>
      </p>
    </>
  );
}
