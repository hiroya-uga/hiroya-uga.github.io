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

export const Toast = ({ message, setMessage, duration = 1000 }: Props) => {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const setTimeoutId = useRef(-1);

  useEffect(() => {
    const div = document.getElementById(DIALOG_PORTAL_ID);

    if (div instanceof HTMLDivElement === false) {
      return;
    }

    setPortal(div);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null) {
      return;
    }

    if (message === '') {
      dialog.open = false;
      return;
    }

    dialog.textContent = message;
    dialog.open = true;

    clearTimeout(setTimeoutId.current);
    setTimeoutId.current = window.setTimeout(() => {
      dialog.open = false;
    }, duration);
  }, [duration, message]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog === null || portal === null) {
      return;
    }

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.target instanceof HTMLDialogElement &&
          mutation.target.open === false
        ) {
          setTimeoutId.current = window.setTimeout(() => {
            dialog.textContent = '';
            setMessage('');
          }, TRANSITION_DURATION);
        }
      }
    });
    mutationObserver.observe(dialog, {
      attributes: true,
      attributeFilter: ['open'],
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
    <dialog
      ref={dialogRef}
      role="alert"
      aria-label="通知"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-4 mx-auto block w-fit rounded-md px-4 py-2 opacity-0 shadow-sticky transition-fade open:pointer-events-auto open:opacity-100"
    />,
    portal,
  );
};
