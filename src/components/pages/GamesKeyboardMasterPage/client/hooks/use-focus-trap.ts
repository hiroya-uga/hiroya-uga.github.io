'use client';

import { RefObject, useEffect } from 'react';

interface Props {
  containerRef: RefObject<HTMLElement | null>;
}

/** コンテナの外へフォーカスが出たら、コンテナへ引き戻す */
export const useFocusTrap = ({ containerRef }: Props) => {
  useEffect(() => {
    const handleFocus = () => {
      const container = containerRef.current;

      if (container === null || container.contains(document.activeElement)) {
        return;
      }

      container.focus();
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('focusin', handleFocus);
    };
  }, [containerRef]);
};
