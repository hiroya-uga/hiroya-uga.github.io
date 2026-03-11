import { useEffect, useState } from 'react';

export const useBeforeUnload = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = ref;

    if (container instanceof HTMLElement === false) {
      return;
    }

    const onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    const onchange = () => {
      window.addEventListener('beforeunload', onbeforeunload);
    };

    container.addEventListener('change', onchange, {
      once: true,
    });
    return () => {
      container.removeEventListener('change', onchange);
      globalThis.window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, [ref]);

  return {
    ref: setRef,
  };
};
