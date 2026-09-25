'use client';

import { Modal } from '@/components/ui/dialogs/Modal';
import { Switch } from '@/components/ui/forms';
import { useState } from 'react';
import type { KeyboardMasterConfig } from '../hooks';

interface Props {
  config: KeyboardMasterConfig;
  onChangeConfig: (patch: Partial<KeyboardMasterConfig>) => void;
  onStart: () => void;
}

const CONFIG_ITEMS: { key: keyof KeyboardMasterConfig; label: string }[] = [
  { key: 'shouldDisableTimeLimit', label: '時間制限無効' },
  { key: 'shouldDisableAnimation', label: 'アニメーション表現無効' },
];

export const IdleScreen = ({ config, onChangeConfig, onStart }: Readonly<Props>) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <p>
        <button
          type="button"
          className="bg-secondary border-primary absolute bottom-4 right-4 z-10 rounded border p-2"
          onClick={() => {
            setIsConfigOpen(true);
          }}
        >
          CONFIG
        </button>
      </p>
      <Modal title="CONFIG" isOpen={isConfigOpen} setIsOpen={setIsConfigOpen}>
        <div className="space-y-3">
          {CONFIG_ITEMS.map(({ key, label }) => (
            <p key={key}>
              <label className="border-secondary flex flex-wrap items-center justify-between gap-2 rounded-xl border px-2 py-3">
                <span className="grow text-left text-sm">{label}</span>
                <span>
                  <Switch
                    checked={config[key]}
                    onChange={(e) => {
                      onChangeConfig({ [key]: e.currentTarget.checked });
                    }}
                  />
                </span>
              </label>
            </p>
          ))}
        </div>
      </Modal>
      <p className="absolute inset-0 grid place-items-center">
        <button
          type="button"
          aria-live="polite"
          className="size-[90%] rounded text-5xl"
          onClick={(e) => {
            // detail === 0 はキーボード操作(Enter/Space)経由のクリックのみを通す
            if (e.detail === 0) {
              onStart();
              return;
            }

            e.currentTarget.textContent = 'Press Enter!';
          }}
        >
          Click to start!
        </button>
      </p>
    </>
  );
};
