'use client';

import { usePortal } from '@/hooks/use-portal';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useEffect, useId, useRef } from 'react';

import styles from './Modal.module.css';

interface Props {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const Modal = ({ title, children, isOpen, setIsOpen }: Readonly<Props>) => {
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
      setIsOpen(false);
      return;
    }

    // CSSOM再生成
    ref.current?.scrollHeight;
    dialog.showModal();
  }, [isOpen, setIsOpen]);

  if (!isPortalReady) {
    return null;
  }

  return renderDialog(
    <dialog
      ref={ref}
      aria-labelledby={id}
      className={clsx([
        styles.root,
        'shadow-sticky bg-secondary [[open]]:pointer-events-auto [[open]]:opacity-100 group pointer-events-none fixed inset-0 z-50 m-auto block w-fit rounded-lg px-8 py-6 text-center opacity-0 transition-[opacity,visibility,bottom]',
      ])}
      aria-modal="true"
      closedby="any"
      onClose={() => setIsOpen(false)}
    >
      <div className="invisible group-open:visible">
        <h2 id={id} className="mb-paragraph text-center font-bold">
          {title}
        </h2>

        <div className="p-16PX pt-0">{children}</div>
      </div>
    </dialog>,
  );
};
