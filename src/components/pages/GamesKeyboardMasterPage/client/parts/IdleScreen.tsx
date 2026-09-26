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
          // ボタン全面に outline が出るとキーキャップとの対応が分かりにくいので、フォーカスの輪郭は枠側に出す
          className="group grid size-full place-items-center content-center gap-8 rounded outline-none"
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
          {/* 影(8px)が outline に重ならないよう、影の分だけ下に余白を持つ枠を outline の対象にする。アニメーションは内側だけが動く */}
          <span className="outline-link pb-8PX block rounded-xl group-focus-visible:outline-2 group-focus-visible:outline-offset-4">
            {/* key を変えて作り直すことで、クリックのたびに揺れを最初から再生する */}
            <span
              key={clickCount <= 1 ? '' : clickCount}
              aria-hidden="true"
              className={clsx([
                'border-accent bg-secondary text-primary group-active:translate-y-6PX min-w-160PX block rounded-xl border-2 px-8 py-4 text-center text-[40px] font-bold shadow-[0_8px_0_var(--color-accent)] group-active:shadow-[0_2px_0_var(--color-accent)]',
                config.flags.animation && (clickCount <= 1 ? styles.pulse : styles.shake),
              ])}
            >
              Enter
            </span>
          </span>
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
