'use client';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { clamp } from '@/utils/number';
import { useCallback, useEffect, useRef, useState } from 'react';
import { QUESTS } from '../quests';
import type { KeyboardMasterBestRecord } from '../types';

const SAVEDATA_KEY = 'savedata-keyboard-master';
// 問題数入力のキー連打のたびに書き込まないよう、保存だけ間引く
const SAVE_DEBOUNCE_MS = 400;

const saveConfig = (next: KeyboardMasterConfig) => {
  setLocalStorage(SAVEDATA_KEY, {
    flags: next.flags,
    tryCount: next.tryCount,
    questCount: next.questCount,
    best: next.best ?? undefined,
  });
};

export type KeyboardMasterFlags = {
  timeLimit: boolean;
  animation: boolean;
  random: boolean;
};

export type KeyboardMasterConfig = {
  flags: KeyboardMasterFlags;
  best: KeyboardMasterBestRecord | null;
  // これまでに開始した「全問プレイ」の回数
  tryCount: number;
  // 3回目以降の挑戦で出題する問題数
  questCount: number;
};

// 全問(40問超)をいきなり既定値にすると多すぎるので、絞った10問をランダム出題する既定値にする
const DEFAULT_QUEST_COUNT = 10;

const DEFAULT_CONFIG: KeyboardMasterConfig = {
  flags: {
    timeLimit: false,
    animation: true,
    random: false,
  },
  best: null,
  tryCount: 0,
  questCount: DEFAULT_QUEST_COUNT,
};

/**
 * ゲーム設定と自己ベストを保持する。
 * localStorageは保存のたびに全体を書き換えるため、常に全項目を書き出す。
 */
export const useKeyboardMasterConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  // 更新関数の identity を固定するため、最新の設定は ref でも持つ(結果画面の effect から呼ばれる)
  const configRef = useRef(DEFAULT_CONFIG);
  const saveTimeoutRef = useRef(-1);

  const commit = useCallback((next: KeyboardMasterConfig) => {
    configRef.current = next;
    setConfig(next);

    window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      saveConfig(next);
    }, SAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const flush = () => {
      window.clearTimeout(saveTimeoutRef.current);
      saveConfig(configRef.current);
    };

    // タブを閉じる・戻るなどアンマウントを経由しない離脱でも保存待ちの変更を失わないようにする
    window.addEventListener('beforeunload', flush);

    return () => {
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, []);

  useEffect(() => {
    const saveData = getLocalStorage(SAVEDATA_KEY);
    const loaded: KeyboardMasterConfig = {
      flags: {
        timeLimit: saveData?.flags?.timeLimit ?? DEFAULT_CONFIG.flags.timeLimit,
        animation: saveData?.flags?.animation ?? DEFAULT_CONFIG.flags.animation,
        random: saveData?.flags?.random ?? DEFAULT_CONFIG.flags.random,
      },
      best: saveData?.best ?? DEFAULT_CONFIG.best,
      tryCount: saveData?.tryCount ?? DEFAULT_CONFIG.tryCount,
      // 問題を減らしたときや壊れた保存データが残っていても範囲外にならないようクランプする
      questCount: clamp({ value: saveData?.questCount ?? DEFAULT_CONFIG.questCount, min: 1, max: QUESTS.all.length }),
    };

    configRef.current = loaded;
    setConfig(loaded);
  }, []);

  const updateFlags = useCallback(
    (patch: Partial<KeyboardMasterFlags>) => {
      commit({ ...configRef.current, flags: { ...configRef.current.flags, ...patch } });
    },
    [commit],
  );

  const updateBest = useCallback(
    (best: KeyboardMasterBestRecord) => {
      commit({ ...configRef.current, best });
    },
    [commit],
  );

  const updateTryCount = useCallback(
    (tryCount: number) => {
      commit({ ...configRef.current, tryCount });
    },
    [commit],
  );

  const updateQuestCount = useCallback(
    (questCount: number) => {
      commit({ ...configRef.current, questCount });
    },
    [commit],
  );

  return { config, updateFlags, updateBest, updateTryCount, updateQuestCount };
};
