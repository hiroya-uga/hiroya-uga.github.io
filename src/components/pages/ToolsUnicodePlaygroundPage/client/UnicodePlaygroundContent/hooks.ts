'use client';

import { useState } from 'react';

import { useAchievement } from '@/hooks/use-achievement';
import type { Lang } from '@/types/lang';
import { getStringMetrics } from '@/utils/unicode';

export const useUnicodePlaygroundState = (initialValue: string, lang: Lang = 'ja') => {
  const [value, setValue] = useState(initialValue);
  const [stepIndex, setStepIndex] = useState([...value].length - 1);
  const [multiline, setMultiline] = useState(false);
  const { toastProps, unlock } = useAchievement();

  const applyValue = (nextValue: string) => {
    setValue(nextValue);
    setStepIndex(Math.max(0, [...nextValue].length - 1));

    if (nextValue.includes('\n') || nextValue.includes('\r')) {
      setMultiline(true);
    }

    const { graphemeCount, codepointCount } = getStringMetrics(nextValue, lang);
    if (graphemeCount === 1 && codepointCount >= 10) {
      unlock('beyond-a-single-character');
    }
  };

  return { value, stepIndex, setStepIndex, multiline, setMultiline, applyValue, toastProps };
};
