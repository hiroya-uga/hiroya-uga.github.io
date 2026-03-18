'use client';

import { useId, useRef, useState } from 'react';
import { PhotoData } from './constants';
import { TopImage } from './TopImage';
import { TopImageGallery } from './TopImageGallery';
import { WelcomeMessage } from './WelcomeMessage';

export const MainVisualSection = () => {
  const galleryId = useId();
  const galleryToggleButtonRef = useRef<HTMLButtonElement>(null);
  const [galleryState, setGalleryState] = useState({
    shouldShow: false,
    photos: [] as PhotoData[],
  });

  return (
    <>
      <TopImage
        galleryId={galleryId}
        galleryToggleButtonRef={galleryToggleButtonRef}
        galleryState={galleryState}
        setGalleryState={setGalleryState}
      />

      <WelcomeMessage />

      {galleryState.shouldShow && (
        <TopImageGallery
          galleryId={galleryId}
          galleryToggleButtonRef={galleryToggleButtonRef}
          galleryState={galleryState}
          setGalleryState={setGalleryState}
        />
      )}
    </>
  );
};
