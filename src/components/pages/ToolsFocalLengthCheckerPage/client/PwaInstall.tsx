'use client';

import { useEffect, useState } from 'react';

import { RunButton } from '@/components/ui/buttons/RunButton';
import Link from 'next/link';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if (globalThis.window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    globalThis.window.addEventListener('beforeinstallprompt', handler);
    return () => {
      globalThis.window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (installPrompt === null && isIOS === false) {
    return (
      <p>
        詳細は<Link href="/wiki/help/pwa">インストール可能なWebアプリについて</Link>をご覧ください
      </p>
    );
  }

  return (
    <>
      {isIOS && <p>Safariの共有メニューから「ホーム画面に追加」でインストールできます。</p>}
      <p>
        詳しくは<Link href="/wiki/help/pwa">インストール可能なWebアプリについて</Link>をご覧ください
      </p>
      {installPrompt !== null && (
        <p className="mt-10">
          <RunButton
            type="button"
            onClick={async () => {
              await installPrompt.prompt();
              setInstallPrompt(null);
            }}
          >
            このツールをインストール
          </RunButton>
        </p>
      )}
    </>
  );
};
