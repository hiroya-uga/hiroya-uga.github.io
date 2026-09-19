import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { useState } from 'react';

const achievementMessages = {
  'business-card': 'デジタル名刺を見つけた',
} as const;

export type AchievementKey = keyof typeof achievementMessages;

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
      setToastMessage(`🏆 実績解除：${achievementMessages[key]}`);
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
