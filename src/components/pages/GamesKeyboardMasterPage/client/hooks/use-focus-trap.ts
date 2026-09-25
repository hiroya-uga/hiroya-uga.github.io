'use client';

import { RefObject, useEffect } from 'react';

interface Props {
  containerRef: RefObject<HTMLElement | null>;
  isActive: boolean;
}

/** コンテナの外へフォーカスが出たら、コンテナ内の role="status" へ引き戻す */
export const useFocusTrap = ({ containerRef, isActive }: Props) => {
  useEffect(() => {
    if (isActive === false) {
      return;
    }

    containerRef.current?.focus();

    const handleFocus = () => {
      if (containerRef.current?.contains(document.activeElement)) {
        return;
      }
      containerRef.current?.querySelector<HTMLElement>('[role="status"]')?.focus();
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('focusin', handleFocus);
    };
  }, [containerRef, isActive]);
};
