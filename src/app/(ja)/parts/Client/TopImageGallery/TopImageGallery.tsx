'use client';

import { ImageViewModal } from '@/components/Dialog/ImageViewModal';
import { useImageViewModalTransition } from '@/components/Dialog/ImageViewModal/utils';
import { SvgIcon } from '@/components/Icons';
import { Picture } from '@/components/Image';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { PhotoData } from '../constants';
import { getClassNameForPhotoItem, getCSSRowVariables } from './utils';

import styles from './TopImageGallery.module.css';

interface Props {
  galleryId: string;
  galleryToggleButtonRef: React.RefObject<HTMLButtonElement | null>;
  galleryState: { shouldShow: boolean; photos: PhotoData[] };
  setGalleryState: React.Dispatch<React.SetStateAction<{ shouldShow: boolean; photos: PhotoData[] }>>;
}

export const TopImageGallery = ({ galleryId, galleryToggleButtonRef, galleryState, setGalleryState }: Props) => {
  let itemIndex = -1;
  let lineIndex = 0;

  const [modalPhotoIndex, setModalPhotoIndex] = useState<number | null>(null);
  const { openModal, closeModal } = useImageViewModalTransition();

  const freezeGalleryAnimations = () => {
    document.querySelectorAll<HTMLImageElement>(`#${galleryId} img`).forEach((image) => {
      const computed = getComputedStyle(image);
      image.style.objectPosition = computed.objectPosition;
      image.style.animationName = 'none';
    });

    document.querySelectorAll<HTMLElement>(`#${galleryId} li`).forEach((item) => {
      const computed = getComputedStyle(item);
      item.style.opacity = computed.opacity;
      item.style.transform = computed.transform;
      item.style.animationName = 'none';
    });
  };

  const unfreezeGalleryAnimations = () => {
    document.querySelectorAll<HTMLImageElement>(`#${galleryId} img`).forEach((image) => {
      image.style.removeProperty('object-position');
      image.style.removeProperty('animation-name');
    });

    document.querySelectorAll<HTMLElement>(`#${galleryId} li`).forEach((item) => {
      item.style.removeProperty('opacity');
      item.style.removeProperty('transform');
      item.style.removeProperty('animation-name');
    });
  };

  const photos = useMemo(() => {
    const length = Math.ceil((galleryState.photos.length || 1) / 10) * 10;
    return Array.from({ length }, (_, index) => galleryState.photos[index % galleryState.photos.length]);
  }, [galleryState.photos]);

  const shouldRenderGallery = photos.some((photo) => photo === undefined) === false;

  return (
    <div
      id={galleryId}
      className={clsx(styles.root, 'px-content-inline animation-fade-in relative')}
      aria-hidden={galleryState.shouldShow === false ? 'true' : undefined}
    >
      <h2 className="@w640:text-2xl mb-4 text-center text-xl font-bold shadow-none outline-0" tabIndex={-1}>
        Gallery
      </h2>

      {shouldRenderGallery && (
        <div className="flex flex-col-reverse">
          <div className="pt-80PX z-1 pointer-events-none sticky bottom-0 bg-[linear-gradient(to_top,var(--background-color-primary),rgba(255,255,255,0))] pb-4 text-center">
            <p className="max-w-content mx-auto">
              <button
                type="button"
                aria-expanded={true}
                aria-controls={galleryId}
                onClick={() => {
                  galleryToggleButtonRef.current?.focus({
                    preventScroll: true,
                  });
                  galleryToggleButtonRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                  });
                  setGalleryState((prev) => ({ ...prev, shouldShow: false }));
                }}
                className="transition-bg bg-panel-primary text-primary hover:bg-panel-primary-hover dark:border-primary @w640:text-sm @w640:py-1 pointer-events-auto z-10 ml-auto block w-fit rounded-full border border-transparent px-3 py-2 text-xs leading-tight no-underline after:content-['↑']"
              >
                Galleryを閉じる
              </button>
            </p>
          </div>

          <ul
            className={clsx([
              'gap-16PX grid grid-cols-1',
              'xs:grid-cols-2',
              'sm:grid-cols-3',
              'md:grid-cols-4',
              'lg:grid-cols-5',
            ])}
          >
            {photos.map((photoData, index) => {
              itemIndex++;

              if (itemIndex === 10) {
                itemIndex = 0;
                lineIndex++;
              }

              const shouldSNSlink = typeof photoData.instagram === 'string' || typeof photoData.flickr === 'string';
              const imageId = `${galleryId}-photo-${index}`;

              return (
                <li
                  key={index}
                  tabIndex={-1}
                  onClick={(e) => {
                    e.currentTarget.querySelector('a')?.focus();
                  }}
                  style={getCSSRowVariables(itemIndex, lineIndex)}
                  className={clsx([
                    styles.item,
                    'self-stretch',
                    'animate-fade-up bg-secondary group relative overflow-hidden rounded-[8px]',
                    getClassNameForPhotoItem(itemIndex),
                  ])}
                >
                  <Picture
                    src={photoData.src}
                    alt={photoData.caption}
                    width={photoData.width}
                    height={photoData.height}
                    priority={false}
                    className={clsx([
                      styles.image,
                      "block size-full object-cover opacity-0 transition-[scale,opacity] group-focus-within:scale-110 group-hover:scale-110 data-[state='loaded']:opacity-100",
                    ])}
                    id={imageId}
                    onLoad={(e) => (e.currentTarget.dataset.state = 'loaded')}
                  />
                  {shouldSNSlink && (
                    <span className="gap-16PX pb-10PX pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center rounded bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                      {typeof photoData?.instagram === 'string' && (
                        <a
                          href={`https://www.instagram.com/p/${photoData.instagram}/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==`}
                          className="size-60PX hover:scale-120 grid place-items-center rounded-full transition-transform"
                        >
                          <Picture
                            src="/common/images/logos/instagram.svg"
                            alt={`${photoData.caption}をInstagramで見る`}
                            width={30}
                            height={30}
                            className="invert"
                          />
                        </a>
                      )}

                      {typeof photoData?.flickr === 'string' && (
                        <a
                          href={photoData.flickr}
                          className="size-60PX hover:scale-120 grid place-items-center rounded-full transition-transform"
                          hrefLang="en-us"
                        >
                          <Picture
                            src="/common/images/logos/flickr.png"
                            alt={`${photoData.caption}をflickrで見る`}
                            width={48 * 2}
                            height={15 * 2}
                            className="w-48PX h-auto invert"
                          />
                        </a>
                      )}
                    </span>
                  )}
                  <button
                    type="button"
                    className="bottom-8PX right-8PX size-32PX pointer-events-none absolute grid place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
                    aria-label={`${photoData.caption}を拡大表示`}
                    onClick={(e) => {
                      e.stopPropagation();

                      const img = document.getElementById(imageId);

                      if (img instanceof HTMLImageElement === false) {
                        return;
                      }

                      img.style.scale = '1';
                      img.style.transition = 'none';
                      freezeGalleryAnimations();
                      openModal({
                        sourceImage: img,
                        buttonElement: e.currentTarget,
                        handleOpen: () => setModalPhotoIndex(index % galleryState.photos.length),
                      });
                    }}
                  >
                    <span className="size-16PX relative block [--v-fill:white]">
                      <SvgIcon name="expand" alt="" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {modalPhotoIndex !== null && (
        <ImageViewModal
          photos={galleryState.photos}
          currentIndex={modalPhotoIndex}
          handleClose={() => closeModal(() => setModalPhotoIndex(null)).then(unfreezeGalleryAnimations)}
          handleNavigate={setModalPhotoIndex}
        />
      )}
    </div>
  );
};

export type TopImageGalleryProps = Props;
