'use client';

import { SVG_ID_PREFIX, SVG_PORTAL_ID } from '@/constants/id';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type Name =
  | 'article'
  | 'arrow-right'
  | 'arrow2-right'
  | 'book'
  | 'description'
  | 'headphone'
  | 'play'
  | 'new-tab'
  | 'question';
const map = new Map<Name, boolean>();

export const SvgIcon = ({ name, alt }: { name: Name; alt: string }) => {
  const [isReady, setIsReady] = useState(map.get(name) ?? false);

  useEffect(() => {
    if (typeof globalThis.document === 'undefined') {
      return;
    }

    if (map.get(name) === true) {
      setIsReady(true);
      return;
    }

    const portal = document.getElementById(SVG_PORTAL_ID);

    if (!portal) {
      console.warn(`SVG portal with id "${SVG_PORTAL_ID}" not found.`);
      return;
    }

    map.set(name, true);

    (async () => {
      const { getSvg } = await import(`./${name}-icon-svg`);
      portal.insertAdjacentHTML('beforeend', getSvg(`${SVG_ID_PREFIX}-${name}`));
      document.body.appendChild(portal);
      setIsReady(true);
    })();
  }, [name]);

  const svgId = `${SVG_ID_PREFIX}-${name}`;

  return (
    <svg
      role="img"
      aria-label={alt}
      className={clsx(['absolute inset-0 block size-full transition-opacity', isReady === false && 'opacity-0'])}
    >
      <use href={`#${svgId}`} />
    </svg>
  );
};
