import { useCallback, useEffect, useRef } from 'react';

export const useCopyButton = () => {
  const settimeoutIdRef = useRef(-1);

  const handleClickCopyButton = useCallback((value: string, buttonLabel: HTMLElement) => {
    clearTimeout(settimeoutIdRef.current);

    try {
      if (value) {
        navigator.clipboard.writeText(value);
        buttonLabel.textContent = 'Copied!';
      }
    } catch {
      buttonLabel.textContent = 'Error!';
    }

    settimeoutIdRef.current = globalThis.window.setTimeout(() => {
      buttonLabel.textContent = 'Copy';
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(settimeoutIdRef.current);
    };
  });

  return { handleClickCopyButton };
};
