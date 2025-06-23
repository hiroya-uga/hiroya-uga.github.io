'use client';

import { uniqueId } from 'lodash';
import { useEffect, useState } from 'react';

let isRenderingCount = 0;
const id = uniqueId('play-icon-');

export const PlayIcon = ({ alt }: { alt: string }) => {
  const [shouldRenderSymbol, setShouldRenderSymbol] = useState(false);

  useEffect(() => {
    isRenderingCount++;

    if (isRenderingCount === 1) {
      setShouldRenderSymbol(true);
    }

    return () => {
      isRenderingCount--;
      if (isRenderingCount === 0) {
        setShouldRenderSymbol(false);
      }
    };
  }, []);

  return (
    <>
      <svg className="absolute inset-0 block size-full" aria-label={alt}>
        <use href={`#${id}`} />
      </svg>
      {shouldRenderSymbol && <SvgSymbol id={id} />}
    </>
  );
};

const SvgSymbol = ({ id }: { id: string }) => {
  return (
    <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
      <symbol id={id} viewBox="0 0 512 512" x="0px" y="0px">
        <style>
          {`
            .st0{fill:var(--v-fill)}
          `}
        </style>
        <g>
          <path
            className="st0"
            d="M207.063,167.141c-1.031-0.609-2.344-0.641-3.406-0.031c-1.031,0.594-1.688,1.719-1.688,2.938v85.938v85.953
		c0,1.234,0.656,2.344,1.688,2.938c1.063,0.625,2.375,0.594,3.406-0.031l144-85.953c1.031-0.594,1.641-1.703,1.641-2.906
		c0-1.172-0.609-2.297-1.641-2.891L207.063,167.141z"
          ></path>
          <path
            className="st0"
            d="M256,0C114.625,0,0,114.625,0,256s114.625,256,256,256s256-114.625,256-256S397.375,0,256,0z M256,448
		c-105.875,0-192-86.125-192-192S150.125,64,256,64s192,86.125,192,192S361.875,448,256,448z"
          ></path>
        </g>
      </symbol>
    </svg>
  );
};
