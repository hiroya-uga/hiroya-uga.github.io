'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

import styles from '@/components/Clickable/ClickableArea.module.css';
import { useRouter } from 'next/navigation';

type Props = {
  as: 'span' | 'div' | 'li';
  children: React.ReactNode;
  className?: string;
  defaultClickable: string;
};

export const ClickableArea = ({ as, children, className, defaultClickable }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const targetRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const router = useRouter();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      if (targetRef.current instanceof HTMLAnchorElement) {
        if (e.metaKey || e.shiftKey) {
          window.open(targetRef.current.href, '_blank');
          return;
        }

        void router.push(targetRef.current.href);
        return;
      }

      targetRef.current?.click();
    },
    [router],
  );

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

  const props = { className: clsx([styles.root, 'cursor-pointer', className]), onClick };

  switch (as) {
    case 'span':
      return (
        <span ref={ref} {...props}>
          {children}
        </span>
      );

    case 'li':
      return (
        <li ref={ref as React.RefObject<HTMLLIElement>} {...props}>
          {children}
        </li>
      );

    default:
      return (
        <div ref={ref as React.RefObject<HTMLDivElement>} {...props}>
          {children}
        </div>
      );
  }
};
