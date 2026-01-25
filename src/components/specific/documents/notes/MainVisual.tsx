'use client';

import { useState } from 'react';

import { Picture } from '@/components/Image';
import clsx from 'clsx';

export const MainVisual = () => {
  const [loaded, setLoaded] = useState(false);

  const meta =
    typeof document === 'undefined' ? null : document.querySelector<HTMLMetaElement>('[property="og:image"]');
  const src = meta?.content || '';

  return (
    <p className={clsx([loaded || 'opacity-0', 'transition-opacity', 'aspect-1200/630'])}>
      {src && <Picture src={src} width={1200} height={630} alt="" onLoad={() => setLoaded(true)} className="block" />}
    </p>
  );
};
