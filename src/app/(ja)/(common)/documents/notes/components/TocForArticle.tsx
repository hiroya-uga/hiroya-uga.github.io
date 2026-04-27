'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { Toc } from '@/app/(ja)/(common)/documents/notes/components/Toc';
import styles from './TocForArticle.module.css';

export const TocForArticle = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={clsx([!loaded && 'invisible opacity-0', 'transition-fade md:sticky md:top-4'])}>
      <div className={clsx('bg-secondary rounded border border-gray-500 p-4', styles.toc)}>
        <Toc title="目次" onready={() => setLoaded(true)} />
      </div>
    </div>
  );
};
