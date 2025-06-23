'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

import styles from '@/components/Clickable/ClickableArea.module.css';

type Props = {
  as: 'span' | 'div' | 'li';
  children: React.ReactNode;
  className?: string;
  defaultClickable: string;
};

export const ClickableArea = ({ as, children, className, defaultClickable }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (targetRef.current instanceof HTMLAnchorElement) {
      if (e.metaKey || e.shiftKey) {
        window.open(targetRef.current.href, '_blank');
        return;
      }

      window.location.href = targetRef.current.href;

      return;
    }

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
  }, [defaultClickable, children]);

  const TagName = as;

  return (
    <TagName ref={ref as React.Ref<any>} className={clsx([styles.root, 'cursor-pointer', className])} onClick={onClick}>
      {children}
    </TagName>
  );
};
