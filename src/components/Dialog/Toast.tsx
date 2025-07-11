'use client';

import { TRANSITION_DURATION } from '@/constants/css';
import { DIALOG_PORTAL_ID } from '@/constants/id';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  message: string;
  setMessage: (_: string) => void;
  duration?: number;
};

export const Toast = ({ message, setMessage, duration = 3000 }: Props) => {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);
  const setTimeoutId = useRef(-1);

  useEffect(() => {
    const div = document.getElementById(DIALOG_PORTAL_ID);

    if (div instanceof HTMLDivElement === false) {
      return;
    }

    setPortal(div);
  }, []);

  useEffect(() => {
    const toast = ref.current;

    if (toast === null) {
      return;
    }

    if (message === '') {
      toast.hidden = true;
      return;
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(setTimeoutId.current);
    setTimeoutId.current = window.setTimeout(() => {
      toast.hidden = true;
    }, duration);
  }, [duration, message]);

  useEffect(() => {
    const toast = ref.current;

    if (toast === null || portal === null) {
      return;
    }

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLParagraphElement &&
          mutation.target.hidden === true
        ) {
          setTimeoutId.current = window.setTimeout(() => {
            toast.textContent = '';
            setMessage('');
          }, TRANSITION_DURATION);
        }
      }
    });
    mutationObserver.observe(toast, {
      attributes: true,
      attributeFilter: ['hidden'],
    });

    return () => {
      mutationObserver.disconnect();
      clearTimeout(setTimeoutId.current);
    };
  }, [portal, setMessage]);

  if (portal === null) {
    return null;
  }

  return createPortal(
    <p
      ref={ref}
      className="duration-800 no-hidden bg-banner border-l-link fixed right-0 top-4 z-50 mx-auto w-fit max-w-[95%] rounded-l border-l-8 px-4 py-2 pr-6 transition-[right] [box-shadow:1px_2px_6px_#00000099] [&[hidden]]:pointer-events-none [&[hidden]]:right-[-100%]"
      hidden
    />,
    portal,
  );
};
