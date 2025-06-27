'use client';

import { RunButton } from '@/components/Clickable';
import { ConfirmData } from '@/components/Dialog/confirm-hooks';
import { TRANSITION_DURATION } from '@/constants/css';
import { DIALOG_PORTAL_ID } from '@/constants/id';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  confirm: ConfirmData;
  setConfirmData: (_: ConfirmData) => void;
  duration?: number;
};

export const Confirm = ({ confirm, setConfirmData }: Props) => {
  const id = useId();
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const setTimeoutId = useRef(-1);

  useEffect(() => {
    const div = document.getElementById(DIALOG_PORTAL_ID);

    if (div instanceof HTMLDivElement === false) {
      return;
    }

    setPortal(div);
  }, []);

  useEffect(() => {
    const dialog = ref.current;

    if (dialog === null) {
      return;
    }

    if (confirm.message === '') {
      dialog.close();
      return;
    }

    dialog.showModal();
  }, [confirm.message]);

  useEffect(() => {
    const dialog = ref.current;

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
            setConfirmData({
              ...confirm,
              message: '',
            });
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
  }, [confirm, portal, setConfirmData]);

  if (portal === null) {
    return null;
  }

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={id}
      className="fixed inset-0 bottom-[15%] z-50 m-auto w-fit rounded-lg bg-white py-6 px-8 opacity-0 pointer-events-none shadow-sticky block transition-fade [&[open]]:pointer-events-auto [&[open]]:opacity-100 text-center invisible [&[open]]:visible"
    >
      <h2 id={id} className="text-center font-bold mb-3">
        {confirm.message}
      </h2>

      {confirm.children}

      <div className="mt-6">
        {typeof confirm.no === 'undefined' ? (
          <p>
            <RunButton
              onClick={() => {
                confirm.yes?.();
                ref.current?.close();
              }}
            >
              はい
            </RunButton>
          </p>
        ) : (
          <ul className="flex justify-center gap-4">
            <li>
              <RunButton
                onClick={() => {
                  confirm.yes?.();
                  ref.current?.close();
                }}
              >
                はい
              </RunButton>
            </li>
            <li>
              <RunButton
                onClick={() => {
                  confirm.no?.();
                  ref.current?.close();
                }}
              >
                いいえ
              </RunButton>
            </li>
          </ul>
        )}
      </div>
    </dialog>,
    portal,
  );
};
