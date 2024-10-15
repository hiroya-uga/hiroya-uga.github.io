'use client';

import { Toc } from '@/components/specific/documents/Toc';
import clsx from 'clsx';
import { useState } from 'react';

import styles from '@/components/specific/documents/ui-notes/TocForArticle.module.css';

export const TocForArticle = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={clsx([!loaded && 'invisible opacity-0', 'transition-[opacity_visibility] md:sticky md:top-4'])}>
      <div className={clsx('rounded border border-gray-500 bg-white p-4 pt-2', styles.toc)}>
        <Toc title="目次" setLoaded={setLoaded} />
      </div>
    </div>
  );
};
