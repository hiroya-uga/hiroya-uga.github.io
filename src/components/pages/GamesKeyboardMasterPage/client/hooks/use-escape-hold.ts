'use client';

import { useEffect } from 'react';

const ESCAPE_HOLD_DURATION = 3000;

interface Props {
  isActive: boolean;
  onAbort: () => void;
}

/** Escape を ESCAPE_HOLD_DURATION 以上押し続けたら onAbort を呼ぶ */
export const useEscapeHold = ({ isActive, onAbort }: Props) => {
  useEffect(() => {
    if (isActive === false) {
      return;
    }

    let timeoutId: number | null = null;

    const clearHoldTimeout = () => {
      if (timeoutId === null) {
        return;
      }

      window.clearTimeout(timeoutId);
      timeoutId = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 長押し判定なので keydown の連続発火(e.repeat)ではタイマーを張り直さない
      if (e.key !== 'Escape' || e.repeat || timeoutId !== null) {
        return;
      }

      timeoutId = window.setTimeout(onAbort, ESCAPE_HOLD_DURATION);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      clearHoldTimeout();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearHoldTimeout();
    };
  }, [isActive, onAbort]);
};
