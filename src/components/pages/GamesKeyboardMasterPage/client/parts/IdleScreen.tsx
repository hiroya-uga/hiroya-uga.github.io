'use client';

import { Modal } from '@/components/ui/dialogs/Modal';
import { Switch, TextField } from '@/components/ui/forms';
import { isKeyboardActivatedClick } from '@/utils/keyboard';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardMasterConfig, KeyboardMasterFlags } from '../hooks';
import { QUESTS } from '../quests';
import styles from './IdleScreen.module.css';

interface Props {
  config: KeyboardMasterConfig;
  shouldFocusStart: boolean;
  // 失敗した問題だけをやり直すときの問題数。全問プレイなら null
  retryCount: number | null;
  onChangeFlags: (patch: Partial<KeyboardMasterFlags>) => void;
  onChangeQuestCount: (questCount: number) => void;
  onClearRetry: () => void;
  onStart: () => void;
}

const CONFIG_ITEMS: { key: keyof KeyboardMasterFlags; label: string }[] = [
  { key: 'timeLimit', label: '時間制限' },
  { key: 'animation', label: 'アニメーション表現' },
  { key: 'random', label: 'ランダム出題' },
];

export const IdleScreen = ({
  config,
  shouldFocusStart,
  retryCount,
  onChangeFlags,
  onChangeQuestCount,
  onClearRetry,
  onStart,
}: Readonly<Props>) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const randomHintId = useId();

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
            if (isKeyboardActivatedClick(e)) {
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
      <div className="px-16PX pointer-events-none absolute bottom-4 right-0 z-10 w-full">
        {retryCount !== null ? (
          <p className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 text-sm">
            <span>{`失敗した${retryCount}問だけをやり直します`}</span>
            <button
              type="button"
              className="bg-secondary border-primary rounded border px-2 py-1"
              onClick={onClearRetry}
            >
              全問に戻す
            </button>
          </p>
        ) : (
          <p className="ml-auto w-fit">
            <button
              type="button"
              className="bg-secondary border-primary pointer-events-auto rounded border p-2"
              onClick={() => {
                setIsConfigOpen(true);
              }}
            >
              CONFIG
            </button>
          </p>
        )}
      </div>
      <Modal title="CONFIG" isOpen={isConfigOpen} closeModal={() => setIsConfigOpen(false)}>
        <div className="space-y-3">
          {CONFIG_ITEMS.map(({ key, label }) => (
            <p key={key}>
              <label className="border-secondary flex flex-wrap items-center justify-between gap-2 rounded-xl border px-2 py-3">
                <span className="grow text-left text-sm">{label}</span>
                <span>
                  <Switch
                    checked={config.flags[key]}
                    // ランダム出題は1・2回目には効かないので、2回クリアするまでは切り替えさせない
                    disabled={key === 'random' && config.tryCount < 2}
                    onChange={(e) => {
                      onChangeFlags({ [key]: e.currentTarget.checked });
                    }}
                    aria-describedby={key === 'random' && config.tryCount < 2 ? randomHintId : undefined}
                  />
                </span>
              </label>
            </p>
          ))}
          {config.tryCount < 2 ? (
            // 3回目以降はflags.randomの値に関わらず常にランダム出題になるため、鍵となるのはtryCountで、flags.randomでは判定しない
            <p id={randomHintId}>ランダム出題は3回目以降解放されます。</p>
          ) : (
            <TextField
              type="number"
              label="問題数"
              min={1}
              max={QUESTS.all.length}
              value={String(config.questCount)}
              onInput={(e) => {
                const value = Number.parseInt(e.currentTarget.value, 10);

                if (Number.isNaN(value)) {
                  return;
                }

                if (value < 1) {
                  onChangeQuestCount(1);
                  return;
                }

                if (QUESTS.all.length < value) {
                  onChangeQuestCount(QUESTS.all.length);
                  return;
                }

                onChangeQuestCount(value);
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
