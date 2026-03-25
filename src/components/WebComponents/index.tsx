'use client';
import { CustomImage } from '@/components/WebComponents/custom-img';
import { useLayoutEffect, useRef } from 'react';

export const LoadWebComponents = () => {
  const isInitialized = useRef(false);

  useLayoutEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (typeof customElements.get('customされたimg要素ˆ-ˆ') === 'undefined') {
      CustomImage();
    }
  }, []);

  return null;
};
