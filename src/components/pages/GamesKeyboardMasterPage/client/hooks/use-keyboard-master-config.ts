'use client';

import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { QUESTS } from '../quests';
import type { KeyboardMasterBestRecord } from '../types';

const SAVEDATA_KEY = 'savedata-keyboard-master';

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

  const commit = useCallback((next: KeyboardMasterConfig) => {
    configRef.current = next;
    setConfig(next);
    setLocalStorage(SAVEDATA_KEY, {
      flags: next.flags,
      tryCount: next.tryCount,
      questCount: next.questCount,
      ...(next.best !== null && { best: next.best }),
    });
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
      // 問題を減らしたときに範囲外の値が残っていても壊れないようクランプする
      questCount: Math.min(saveData?.questCount ?? DEFAULT_CONFIG.questCount, QUESTS.all.length),
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
