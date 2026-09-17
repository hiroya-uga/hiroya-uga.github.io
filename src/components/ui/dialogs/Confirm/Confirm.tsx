'use client';

import { ModalButtons } from '@/components/ui/dialogs/shared';
import { TRANSITION_DURATION } from '@/constants/css';
import { useDialog } from '@/hooks/use-dialog';
import clsx from 'clsx';
import { useEffect, useId, useRef } from 'react';

import styles from './Confirm.module.css';

export type ConfirmData = {
  message: string;
  children?: React.ReactNode;
  yesLabel?: string;
  noLabel?: string;
  yes: () => void;
  no?: () => void;
};

type Props = {
  confirm: ConfirmData | null;
  setConfirmData: (data: ConfirmData | null) => void;
};

export const Confirm = ({ confirm, setConfirmData }: Readonly<Props>) => {
  const id = useId();
  const { isPortalReady, renderDialog } = useDialog();
  const ref = useRef<HTMLDialogElement>(null);
  const setTimeoutId = useRef(-1);
  const cachedConfirmRef = useRef(confirm);

  if (confirm !== null) {
    cachedConfirmRef.current = confirm;
  }

  const data = cachedConfirmRef.current;

  useEffect(() => {
    const dialog = ref.current;

    if (dialog === null) {
      return;
    }

    if (confirm === null) {
      dialog.close();
      return;
    }

    // CSSOM再生成
    ref.current?.scrollHeight;
    dialog.showModal();
  }, [confirm]);

  useEffect(() => {
    const dialog = ref.current;

    if (dialog === null || !isPortalReady) {
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
            setConfirmData(null);
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
  }, [isPortalReady, setConfirmData]);

  if (!isPortalReady || data === null) {
    return null;
  }

  const yesLabel = data.yesLabel ?? 'はい';
  const noLabel = data.noLabel ?? 'いいえ';
  const yesAction = {
    label: yesLabel,
    onClick: () => {
      data.yes?.();
      ref.current?.close();
    },
  };
  const items =
    data.no === undefined
      ? [yesAction]
      : [
          yesAction,
          {
            label: noLabel,
            onClick: () => {
              data.no?.();
              ref.current?.close();
            },
          },
        ];

  const hasContent = data.children !== undefined && data.children !== null;

  return renderDialog(
    <dialog
      ref={ref}
      aria-labelledby={id}
      className={clsx([
        styles.root,
        'shadow-sticky bg-secondary [[open]]:pointer-events-auto [[open]]:visible [[open]]:opacity-100 pointer-events-none invisible fixed inset-0 z-50 m-auto block w-fit rounded-lg px-8 py-6 text-center opacity-0 transition-[opacity,visibility,bottom]',
      ])}
      role="alertdialog"
      aria-modal="true"
      closedby="none"
    >
      <h2 id={id} className={clsx(['text-center font-bold', hasContent ? 'mb-paragraph' : 'mb-6'])}>
        {data.message}
      </h2>

      {data.children}

      <div className={clsx([hasContent && 'mt-[calc(var(--spacing-paragraph)*1.5)]'])}>
        <ModalButtons items={items} />
      </div>
    </dialog>,
  );
};
