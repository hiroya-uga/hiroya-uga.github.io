'use client';

import { Toc } from '@/components/specific/documents/Toc';
import clsx from 'clsx';
import { useState } from 'react';

export const TocForArticle = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={clsx([!loaded && 'invisible opacity-0', 'transition-[opacity_visibility] md:sticky md:top-4'])}>
      <div id="toc" className="rounded border border-gray-500 bg-white p-4 pt-2">
        <Toc title="目次" setLoaded={setLoaded} />
      </div>
    </div>
  );
};
