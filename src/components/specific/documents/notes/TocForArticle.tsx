'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { Toc } from '@/components/specific/documents/Toc';
import styles from '@/components/specific/documents/notes/TocForArticle.module.css';

export const TocForArticle = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={clsx([!loaded && 'invisible opacity-0', 'transition-fade md:sticky md:top-4'])}>
      <div className={clsx('bg-banner rounded border border-gray-500 p-4', styles.toc)}>
        <Toc title="目次" setLoaded={setLoaded} />
      </div>
    </div>
  );
};
