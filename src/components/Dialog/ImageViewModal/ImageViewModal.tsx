'use client';

import { SvgIcon } from '@/components/Icons';
import { Picture } from '@/components/Image';
import { DIALOG_PORTAL_ID } from '@/constants/id';
import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { IMAGE_MODAL_VIEW_TRANSITION_NAME } from './utils';

export type ImageData = {
  src: string;
  caption: string;
  description: string;
  date: string;
  width: number;
  height: number;
};

interface Props {
  images: ImageData[];
  currentIndex: number;
  handleClose: () => void;
  handleNavigate: (index: number) => void;
}

export const ImageViewModal = ({ images, currentIndex, handleClose, handleNavigate }: Props) => {
  const id = useId();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = images[currentIndex];
  const total = images.length;

  const portal = useSyncExternalStore(
    () => () => {},
    () => document.getElementById(DIALOG_PORTAL_ID),
    () => null,
  );

  useEffect(() => {
    document.documentElement.dataset.modal = 'open';
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNavigate((currentIndex - 1 + total) % total);
      } else if (e.key === 'ArrowRight') {
        handleNavigate((currentIndex + 1) % total);
      }
    };
    globalThis.window.addEventListener('keydown', handleKeyDown);
    return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total, handleNavigate]);

  if (portal === null) return null;

  return createPortal(
    <dialog // NOSONAR
      ref={dialogRef}
      aria-label="画像ビューア"
      aria-modal="true"
      closedby="closerequest"
      className="@container fixed inset-0 m-0 grid h-dvh max-h-none w-dvw max-w-none grid-rows-[auto_1fr_auto] bg-black/85 p-0 text-white backdrop:opacity-0 dark:bg-black/80"
      onClick={(e) => {
        // dialog要素が全画面を覆い尽くすのでユーザは backdrop に触れないため onClick イベントハンドラを用意する。
        e.preventDefault();
        handleClose();
      }}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
    >
      <div className="px-8PX py-12PX grid grid-cols-[1fr_auto] items-center">
        <p aria-hidden="true" className="text-sm tabular-nums text-white/70" onClick={(e) => e.stopPropagation()}>
          {currentIndex + 1} / {total}
        </p>
        <p>
          <button
            // closeby=any の代替目的で dialog 要素全域に onClick で閉じるようになっている。
            // この閉じるボタンは dialog 要素へのバブリングで動作するため onClick は不要。
            type="button"
            className="transition-bg bg-panel-primary hover:bg-panel-primary-hover size-40PX grid place-items-center rounded-full"
            aria-label="閉じる"
          >
            <span className="size-16PX relative block">
              <SvgIcon name="cross" alt="" />
            </span>
          </button>
        </p>
      </div>

      <div className="gap-x-8PX px-8PX grid min-h-0 grid-cols-[auto_1fr_auto] items-center">
        <p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate((currentIndex - 1 + total) % total);
            }}
            className="transition-bg bg-panel-primary hover:bg-panel-primary-hover size-48PX grid select-none place-items-center rounded-full"
          >
            <span className="size-20PX relative block">
              <SvgIcon name="arrow2-left" alt="前の画像" />
            </span>
          </button>
        </p>

        <p>
          <Picture
            src={photo.src}
            alt={photo.caption}
            width={photo.width}
            height={photo.height}
            priority
            className="h-auto max-h-[calc(100dvh-12rem)] min-h-0 max-w-full object-contain"
            style={{ viewTransitionName: IMAGE_MODAL_VIEW_TRANSITION_NAME }}
            aria-describedby={['index', 'spec', 'data'].map((key) => `${id}-${key}`).join(' ')}
            onClick={(e) => e.stopPropagation()}
          />
        </p>
        <p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate((currentIndex + 1) % total);
            }}
            className="transition-bg bg-panel-primary hover:bg-panel-primary-hover size-48PX grid select-none place-items-center rounded-full"
          >
            <span className="size-20PX relative block">
              <SvgIcon name="arrow2-right" alt="次の画像" />
            </span>
          </button>
        </p>
      </div>

      <div
        className="p-8PX pb-16PX min-h-140px @w640:min-h-0 grid items-end text-center text-sm"
        aria-live="polite"
        aria-atomic="true"
        id={id}
      >
        <div // NOSONAR
          onClick={(e) => e.stopPropagation()}
        >
          <p className="sr-only" id={`${id}-index`}>{`${total}枚中${currentIndex + 1}枚目`}</p>
          <p className="font-bold">{photo.caption}</p>
          <p className="mt-0.5 text-[#b3b3b3]" id={`${id}-description`}>
            {photo.description}
          </p>
          <p className="mt-1 font-mono text-xs text-[#989898]" id={`${id}-date`}>
            {photo.date}
          </p>
        </div>
      </div>
    </dialog>,
    portal,
  );
};
