'use client';

import { Modal } from '@/components/ui/dialogs/Modal';
import { Switch } from '@/components/ui/forms';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardMasterConfig, KeyboardMasterFlags } from '../hooks';
import styles from './IdleScreen.module.css';

interface Props {
  config: KeyboardMasterConfig;
  shouldFocusStart: boolean;
  onChangeFlags: (patch: Partial<KeyboardMasterFlags>) => void;
  onStart: () => void;
}

const CONFIG_ITEMS: { key: keyof KeyboardMasterFlags; label: string }[] = [
  { key: 'timeLimit', label: '時間制限' },
  { key: 'animation', label: 'アニメーション表現' },
  { key: 'random', label: 'ランダム出題' },
];

export const IdleScreen = ({ config, shouldFocusStart, onChangeFlags, onStart }: Readonly<Props>) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // ref コールバックだと再描画のたびに走り、CONFIG モーダルからフォーカスを奪うので、値が変わったときだけ走る effect にする
  useEffect(() => {
    if (shouldFocusStart) {
      startButtonRef.current?.focus();
    }
  }, [shouldFocusStart]);

  return (
    <>
      <p className="absolute inset-0 grid place-items-center">
        <button
          ref={startButtonRef}
          type="button"
          aria-live="polite"
          className={clsx(['size-[90%] rounded', styles.root])}
          onClick={(e) => {
            // detail === 0 はキーボード操作(Enter/Space)経由のクリックのみを通す
            if (e.detail === 0) {
              onStart();
              return;
            }

            setClickCount((current) => current + 1);

            // for Safari
            e.currentTarget.focus();
          }}
        >
          {/* key を変えて作り直すことで、クリックのたびに揺れを最初から再生する */}
          <kbd
            key={clickCount}
            aria-hidden="true"
            className={clsx([styles.keycap, config.flags.animation && (clickCount <= 1 ? styles.pulse : styles.shake)])}
          >
            Enter
          </kbd>
          <span className={clsx(clickCount === 0 ? 'opacity-0' : 'transition-opacity')}>
            {clickCount <= 1 ? 'Enterキーを押してスタート' : 'クリックでは始まりません。Enterキーを押してください'}
          </span>
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
      <Modal title="CONFIG" isOpen={isConfigOpen} closeModal={() => setIsConfigOpen(false)}>
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
