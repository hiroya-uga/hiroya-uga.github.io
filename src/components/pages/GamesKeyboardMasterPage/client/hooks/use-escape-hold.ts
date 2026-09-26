'use client';

import { useEffect, useState } from 'react';

export const ESCAPE_HOLD_DURATION = 3000;

interface Props {
  isActive: boolean;
  onAbort: () => void;
}

/** Escape を ESCAPE_HOLD_DURATION 以上押し続けたら onAbort を呼ぶ。押し続けている間は isHolding が true になる */
export const useEscapeHold = ({ isActive, onAbort }: Props) => {
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (isActive === false) {
      return;
    }

    let timeoutId: number | null = null;

    const clearHoldTimeout = () => {
      setIsHolding(false);

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

      setIsHolding(true);
      timeoutId = window.setTimeout(() => {
        clearHoldTimeout();
        onAbort();
      }, ESCAPE_HOLD_DURATION);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      clearHoldTimeout();
    };

    const handleLeave = () => {
      clearHoldTimeout();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleLeave);
    document.addEventListener('visibilitychange', handleLeave);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('visibilitychange', handleLeave);
      clearHoldTimeout();
    };
  }, [isActive, onAbort]);

  return { isHolding };
};
