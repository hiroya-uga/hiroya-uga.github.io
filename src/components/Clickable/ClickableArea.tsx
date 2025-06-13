'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

import styles from '@/components/Clickable/ClickableArea.module.css';

type Props = {
  as: 'span' | 'div';
  children: React.ReactNode;
  className?: string;
  defaultClickable: string;
};

export const ClickableArea = ({ as, children, className, defaultClickable }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const onClick = useCallback((e: React.MouseEvent<HTMLSpanElement | HTMLDivElement>) => {
    e.preventDefault();
    targetRef.current?.click();
  }, []);

  useEffect(() => {
    const target = ref.current?.querySelector<HTMLElement>(`[id="${defaultClickable}"]`);

    if (target instanceof HTMLAnchorElement === false && target instanceof HTMLButtonElement === false) {
      return;
    }

    targetRef.current = target;
    target.style.setProperty('outline', 'none');

    return () => {
      target.style.removeProperty('outline');
    };
  }, [defaultClickable]);

  const TagName = as;

  return (
    <TagName ref={ref as React.Ref<any>} className={clsx([styles.root, 'cursor-pointer', className])} onClick={onClick}>
      {children}
    </TagName>
  );
};
