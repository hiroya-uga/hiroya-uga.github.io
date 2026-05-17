'use client';

import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { RunButton } from '@/components/ui/buttons/RunButton';
import { TRANSITION_DURATION } from '@/constants/css';
import { DIALOG_PORTAL_ID } from '@/constants/id';

import { TextField } from '@/components/ui/forms';
import { PromptData } from './hooks';

type Props = {
  prompt: PromptData;
  setPromptData: (_: PromptData) => void;
};

export const PromptModal = ({ prompt, setPromptData }: Readonly<Props>) => {
  const id = useId();
  const inputId = useId();
  const portal = useSyncExternalStore(
    () => () => () => {},
    () => {
      const div = document.getElementById(DIALOG_PORTAL_ID);
      return div instanceof HTMLDivElement ? div : null;
    },
    () => null,
  );
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setTimeoutId = useRef(-1);

  useEffect(() => {
    const dialog = ref.current;

    if (dialog === null) {
      return;
    }

    if (prompt.message === '') {
      dialog.close();
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = prompt.defaultValue ?? '';
    }

    dialog.showModal();
  }, [prompt.message, prompt.defaultValue]);

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
            setPromptData({
              ...prompt,
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
  }, [prompt, portal, setPromptData]);

  if (portal === null) {
    return null;
  }

  const handleYes = () => {
    prompt.yes(inputRef.current?.value ?? '');
    ref.current?.close();
  };

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={id}
      className="shadow-sticky transition-fade bg-secondary [[open]]:pointer-events-auto [[open]]:visible [[open]]:opacity-100 px-32PX pointer-events-none invisible fixed inset-0 bottom-[15%] z-50 m-auto block w-fit min-w-[30%] rounded-lg py-6 opacity-0"
      aria-modal="true"
      closedby="none"
    >
      <h2 id={id} className="mb-3 font-bold">
        <label htmlFor={inputId}>{prompt.message}</label>
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleYes();
        }}
      >
        <TextField
          ref={inputRef}
          id={inputId}
          description={prompt.description}
          defaultValue={prompt.defaultValue}
          placeholder={prompt.placeholder}
        />

        <div className="mt-6">
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,5rem),1fr))] gap-4">
            <li>
              <RunButton type="submit" onClick={handleYes}>
                はい
              </RunButton>
            </li>
            <li>
              <RunButton
                onClick={() => {
                  prompt.no?.();
                  ref.current?.close();
                }}
              >
                いいえ
              </RunButton>
            </li>
          </ul>
        </div>
      </form>
    </dialog>,
    portal,
  );
};
