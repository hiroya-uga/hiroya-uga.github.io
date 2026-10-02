'use client';

import { useEffect, useState } from 'react';

interface Props {
  target: number;
  isEnabled: boolean;
  duration?: number;
}

/** 0 から target まで duration ミリ秒かけて整数で数え上げた現在値を返す。無効なら最初から target を返す */
export const useCountUp = ({ target, isEnabled, duration = 800 }: Props) => {
  const [value, setValue] = useState(isEnabled ? 0 : target);

  useEffect(() => {
    if (isEnabled === false || target === 0) {
      setValue(target);
      return;
    }

    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      // 終わり際にゆっくり止まるよう ease-out にする
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [target, isEnabled, duration]);

  return value;
};
