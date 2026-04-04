'use client';

import { useRef } from 'react';
import { flushSync } from 'react-dom';

export const IMAGE_MODAL_VIEW_TRANSITION_NAME = 'image-view-modal';

interface OpenModalParams {
  sourceImage: HTMLImageElement;
  buttonElement: HTMLButtonElement;
  handleOpen: () => void;
}

export const useImageViewModalTransition = () => {
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  const openModal = ({ sourceImage, buttonElement, handleOpen }: OpenModalParams) => {
    triggerButtonRef.current = buttonElement;
    sourceImageRef.current = sourceImage;

    if ('startViewTransition' in document === false) {
      handleOpen();
      return;
    }

    sourceImage.style.viewTransitionName = IMAGE_MODAL_VIEW_TRANSITION_NAME;
    document.startViewTransition(() => {
      flushSync(handleOpen);
      sourceImage.style.removeProperty('view-transition-name');
    });
  };

  const closeModal = async (close: () => void): Promise<void> => {
    const triggerButton = triggerButtonRef.current;
    const sourceImage = sourceImageRef.current;

    if (sourceImage === null || 'startViewTransition' in document === false) {
      close();
      delete document.documentElement.dataset.modal;
      triggerButton?.focus();
      return;
    }

    return document
      .startViewTransition(() => {
        sourceImage.style.viewTransitionName = IMAGE_MODAL_VIEW_TRANSITION_NAME;
        flushSync(close);
      })
      .finished.then(() => {
        sourceImage.style.removeProperty('view-transition-name');
        delete document.documentElement.dataset.modal;
        triggerButton?.focus();
        triggerButtonRef.current = null;
        sourceImageRef.current = null;
      });
  };

  return { openModal, closeModal };
};
