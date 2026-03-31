'use client';

import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './ThePowerOfTheWebSection.module.css';

export const PowerOfTheWebSection = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'already'>('loading');

  useEffect(() => {
    const isViewed = getSessionStorage('power-section-viewed') === 'true';
    requestAnimationFrame(() => {
      if (isViewed) {
        setStatus('already');
        return;
      }

      setStatus('ready');
      setSessionStorage('power-section-viewed', 'true');
    });
  }, []);

  return (
    <div
      className={clsx([
        styles.root,
        'transition-[min-height] duration-1000 ease-in-out',
        status === 'loading' && 'invisible min-h-[50vh]',
        status === 'already' && [styles.already, 'animate-fade-in min-h-0'],
        status === 'ready' && [styles.ready, 'animate-fade-in min-h-[400vh]'],
        'bg-secondary @w640:pb-24 @w640:pt-18 pb-18 pt-14',
      ])}
    >
      <div
        className={clsx([
          status === 'ready' && 'fixed inset-0 grid size-full min-h-screen place-items-center',
          'px-content-inline mx-auto',
        ])}
      >
        <div className={styles.content}>
          <h2 className={styles.heading}>The power of the web</h2>

          <figure className={clsx([(status === 'ready') === false && 'px-content-inline'])}>
            <blockquote cite="https://www.w3.org/mission/accessibility/" lang="en" className={styles.message}>
              <p className="text-balance">
                <span className={styles.quote}>“</span>
                <a
                  href="https://www.w3.org/mission/accessibility/#:~:text=The%20power%20of%20the%20Web%20is%20in%20its%20universality.%20Access%20by%20everyone%20regardless%20of%20disability%20is%20an%20essential%20aspect."
                  className={styles.link}
                >
                  The power of the Web is in its universality. Access by everyone regardless of disability is an
                  essential aspect.
                </a>
                <span className={styles.quote}>”</span>
              </p>
            </blockquote>
            <figcaption className={styles.caption}>
              <p>
                — <cite>Tim Berners-Lee</cite>,{' '}
                <span className="inline-block">W3C Director and inventor of the World Wide Web</span>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
      {status === 'ready' && (
        <p className="animate-fade-in pointer-events-none fixed inset-0 flex items-end justify-end px-4 py-2 text-right text-sm">
          <a
            href="#heading-categories"
            className="pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector<HTMLElement>('#heading-categories');
              if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            ↓ Skip to Categories
          </a>
        </p>
      )}
    </div>
  );
};
