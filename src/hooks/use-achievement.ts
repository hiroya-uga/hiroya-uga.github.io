import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useState } from 'react';

export const ACHIEVEMENTS = {
  'business-card': 'デジタル名刺を見つけた',
  'tweet-share': 'シェアボタンを押した',
} as const;

export type AchievementKey = keyof typeof ACHIEVEMENTS;

export const useAchievement = () => {
  const [toastMessage, setToastMessage] = useState('');

  const unlock = (key: AchievementKey, delay = 0) => {
    const achievement = getLocalStorage('achievement');

    if (achievement?.[key] === true) {
      return;
    }

    setLocalStorage('achievement', {
      ...achievement,
      [key]: true,
    });

    setTimeout(() => {
      setToastMessage(`🏆 実績解除：${ACHIEVEMENTS[key]}`);
    }, delay);
  };

  return {
    toastProps: {
      message: toastMessage,
      setMessage: setToastMessage,
      assertive: true,
    },
    unlock,
  };
};
