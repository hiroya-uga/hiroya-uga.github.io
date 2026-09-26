'use client';

import { usePortal } from '@/hooks/use-portal';
import clsx from 'clsx';
import { useEffect, useId, useRef } from 'react';

import { SvgIcon } from '@/components/ui/media/SvgIcon';
import styles from './Modal.module.css';

interface Props {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}

export const Modal = ({ title, children, isOpen, closeModal }: Readonly<Props>) => {
  const id = useId();
  const { isPortalReady, renderDialog } = usePortal();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    if (dialog === null) {
      return;
    }

    if (isOpen === false) {
      dialog.close();
      closeModal();
      return;
    }

    // CSSOM再生成
    ref.current?.scrollHeight;
    dialog.showModal();
  }, [isOpen, closeModal]);

  if (!isPortalReady) {
    return null;
  }

  return renderDialog(
    <dialog
      ref={ref}
      aria-labelledby={id}
      className={clsx([
        styles.root,
        '[[open]]:opacity-100 group pointer-events-none fixed inset-0 grid size-full max-h-none max-w-none place-items-center items-center bg-transparent opacity-0 transition-[opacity,visibility,bottom]',
      ])}
      aria-modal="true"
      closedby="any"
      onClose={closeModal}
    >
      <div
        className={clsx([
          'invisible group-open:pointer-events-auto group-open:visible',
          'shadow-sticky bg-secondary relative m-auto block max-h-[90%] w-fit min-w-[min(50vw,400px)] max-w-[90%] rounded-lg pb-8 pt-2 text-center',
        ])}
      >
        <div className="mb-paragraph grid grid-cols-[48px_1fr_48px]">
          <h2 id={id} className="py-9PX col-start-2 self-center text-center font-bold">
            {title}
          </h2>

          <p>
            <button type="button" className="p-16PX rounded-full" onClick={closeModal}>
              <span className="relative block size-4">
                <SvgIcon name="cross" alt={`${title}を閉じる`} />
              </span>
            </button>
          </p>
        </div>

        <div className="px-24PX">{children}</div>
      </div>
    </dialog>,
  );
};
