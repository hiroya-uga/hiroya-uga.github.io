'use client';

import { Modal } from '@/components/ui/dialogs/Modal';
import { Switch } from '@/components/ui/forms';
import { useState } from 'react';
import type { KeyboardMasterConfig, KeyboardMasterFlags } from '../hooks';

interface Props {
  config: KeyboardMasterConfig;
  onChangeFlags: (patch: Partial<KeyboardMasterFlags>) => void;
  onStart: () => void;
}

const CONFIG_ITEMS: { key: keyof KeyboardMasterFlags; label: string }[] = [
  { key: 'timeLimit', label: '時間制限' },
  { key: 'animation', label: 'アニメーション表現' },
  { key: 'random', label: 'ランダム出題' },
];

export const IdleScreen = ({ config, onChangeFlags, onStart }: Readonly<Props>) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
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
            // for Safari
            e.currentTarget.focus();
          }}
        >
          Click to start!
        </button>
      </p>
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
                    checked={config.flags[key]}
                    onChange={(e) => {
                      onChangeFlags({ [key]: e.currentTarget.checked });
                    }}
                  />
                </span>
              </label>
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
};
