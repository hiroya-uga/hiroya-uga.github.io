import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { ESCAPE_HOLD_DURATION } from '../hooks';
import styles from './EscapeHoldOverlay.module.css';

interface Props {
  shouldEnableAnimation: boolean;
}

export const EscapeHoldOverlay = ({ shouldEnableAnimation }: Readonly<Props>) => (
  <div
    aria-hidden="true"
    className={clsx([styles.root, shouldEnableAnimation === false && styles.instant])}
    style={
      {
        '--x-duration': `${ESCAPE_HOLD_DURATION}ms`,
        '--x-steps': ESCAPE_HOLD_DURATION / 1000,
      } as CSSProperties
    }
  >
    <div className={styles.gauge}>
      <svg viewBox="0 0 100 100" className={styles.ring}>
        <circle cx="50" cy="50" r="44" className={styles.track} />
        <circle cx="50" cy="50" r="44" pathLength="1" className={styles.progress} />
      </svg>
      <kbd className="text-2xl font-bold">ESC</kbd>
    </div>
    <p className="text-sm">そのまま押し続けると、ゲームを中断します</p>
  </div>
);
