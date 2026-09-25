'use client';

import { useEffect, useState } from 'react';
import type { Quest } from '../quests';

interface Props {
  isDisabled: boolean;
  quest: Quest;
  onTimeout: () => void;
}

/**
 * お題の制限時間をカウントダウンし、0 になったら onTimeout を呼ぶ。
 * 制限時間のないお題や無効化中は null を返す。
 */
export const useQuestTimer = ({ isDisabled, quest, onTimeout }: Props) => {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const { timeLimit } = quest;

    if (timeLimit === undefined || isDisabled) {
      setRemainingMs(null);
      return;
    }

    const deadline = Date.now() + timeLimit;
    setRemainingMs(timeLimit);

    const interval = window.setInterval(() => {
      setRemainingMs(Math.max(0, deadline - Date.now()));
    }, 200);

    const timeout = window.setTimeout(onTimeout, timeLimit);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [isDisabled, quest, onTimeout]);

  return remainingMs;
};
