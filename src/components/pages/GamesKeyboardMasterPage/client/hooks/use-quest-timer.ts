'use client';

import { useEffect, useState } from 'react';
import type { Quest } from '../quests';

interface Props {
  isEnabled: boolean;
  quest: Quest;
  onTimeout: () => void;
}

/**
 * お題の制限時間をカウントダウンし、0 になったら onTimeout を呼ぶ。
 * 制限時間のないお題や無効化中は null を返す。
 */
export const useQuestTimer = ({ isEnabled, quest, onTimeout }: Props) => {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const { timeLimit } = quest;

    if (timeLimit === undefined || isEnabled === false) {
      setRemainingMs(null);
      return;
    }

    const deadline = Date.now() + timeLimit;
    setRemainingMs(timeLimit);

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, deadline - Date.now());
      setRemainingMs(remaining);

      // 表示の更新とタイムアウト判定を同じtickにまとめ、表示が0になる前にonTimeoutが先行しないようにする
      if (remaining === 0) {
        window.clearInterval(interval);
        onTimeout();
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isEnabled, quest, onTimeout]);

  return remainingMs;
};
