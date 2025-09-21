'use client';
import { LazyImageLoad } from '@/components/WebComponents/lazy-image';
import { useLayoutEffect, useRef } from 'react';

export const LoadWebComponents = () => {
  const isInitialized = useRef(false);

  useLayoutEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (typeof customElements.get('lazy-image') === 'undefined') {
      LazyImageLoad();
    }
  }, []);

  return null;
};
