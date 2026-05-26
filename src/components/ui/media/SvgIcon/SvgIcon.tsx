'use client';

import { SVG_ID_PREFIX, SVG_PORTAL_ID } from '@/constants/id';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type Name =
  | 'article'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow2-left'
  | 'arrow2-right'
  | 'book'
  | 'copy'
  | 'cross'
  | 'description'
  | 'expand'
  | 'headphone'
  | 'information'
  | 'play'
  | 'reload'
  | 'new-tab'
  | 'question';
const loadingMap = new Map<Name, Promise<void>>();

interface Props {
  name: Name;
  alt: string;
}

export const SvgIcon = ({ name, alt }: Readonly<Props>) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof globalThis.document === 'undefined') {
      return;
    }

    let loading = loadingMap.get(name);

    if (loading === undefined) {
      const portal = document.getElementById(SVG_PORTAL_ID);

      if (portal === null) {
        console.warn(`SVG portal with id "${SVG_PORTAL_ID}" not found.`);
        return;
      }

      loading = (async () => {
        const { getSvg } = await import(`./${name}-icon-svg`);
        portal.insertAdjacentHTML('beforeend', getSvg(`${SVG_ID_PREFIX}-${name}`));
      })();
      loadingMap.set(name, loading);
    }

    loading.then(() => setIsReady(true));
  }, [name]);

  const svgId = `${SVG_ID_PREFIX}-${name}`;
  const hasAlt = alt !== '';

  return (
    <svg
      role={hasAlt ? 'graphics-symbol' : 'presentation'}
      aria-label={hasAlt ? alt : undefined}
      className={clsx(['absolute inset-0 block size-full transition-opacity', isReady === false && 'opacity-0'])}
    >
      <use href={`#${svgId}`} />
    </svg>
  );
};
