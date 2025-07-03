'use client';
import { LazyImageLoad } from '@/components/WebComponents/lazy-image';
import { useLayoutEffect } from 'react';

export const LoadWebComponents = () => {
  useLayoutEffect(() => {
    if (customElements.get('lazy-image') === undefined) {
      LazyImageLoad();
    }
  }, []);

  return null;
};
