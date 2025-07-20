'use client';

import { useEffect, useState } from 'react';

import { Picture } from '@/components/Image';
import clsx from 'clsx';

export const MainVisual = () => {
  const [src, setSrc] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('[property="og:image"]');

    if (meta?.content) {
      setSrc(meta.content);
    }
  }, []);

  return (
    <p className={clsx([loaded || 'opacity-0', 'transition-opacity', 'aspect-1200/630'])}>
      {src && <Picture src={src} width={1200} height={630} alt="" onLoad={() => setLoaded(true)} className="block" />}
    </p>
  );
};
