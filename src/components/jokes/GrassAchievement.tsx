'use client';

import { Toast } from '@/components/ui/dialogs/Toast';
import { type AchievementKey, useAchievement } from '@/hooks/use-achievement';
import { getLocalStorage } from '@/utils/local-storage';
import { useEffect } from 'react';

const GRASS_ON_GRASS_PATTERN = /草[wｗ]/;
const KEY: AchievementKey = 'kusa-ni-kusa-wo-hayasuna';

const getInputText = (target: EventTarget | null) => {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    return target.value;
  }

  return target instanceof HTMLElement && target.isContentEditable ? target.textContent : null;
};

export const GrassAchievement = () => {
  const { toastProps, unlock } = useAchievement();

  useEffect(() => {
    const achievement = getLocalStorage('achievement');

    if (achievement?.[KEY]) {
      return;
    }

    const handleInput = (event: Event) => {
      const value = getInputText(event.target);

      if (value !== null && GRASS_ON_GRASS_PATTERN.test(value)) {
        unlock(KEY);
      }
    };

    document.addEventListener('input', handleInput);
    return () => document.removeEventListener('input', handleInput);
  }, [unlock]);

  return <Toast {...toastProps} />;
};
