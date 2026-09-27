import type { CSSProperties } from 'react';
import styles from './Confetti.module.css';

const COLORS = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#ff8fab'];

// 乱数だと再描画のたびに配置が変わるので、添字から決まる値で散らす
const PIECES = Array.from({ length: 40 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  color: COLORS[index % COLORS.length],
  duration: `${2200 + ((index * 131) % 1400)}ms`,
  delay: `${(index * 53) % 700}ms`,
  drift: `${((index * 29) % 160) - 80}px`,
  spin: `${360 + ((index * 47) % 540)}deg`,
}));

/** 全問クリアのお祝い。装飾なので支援技術には見せない */
export const Confetti = () => (
  <div aria-hidden="true" className={styles.root}>
    {PIECES.map(({ left, color, duration, delay, drift, spin }) => (
      <span
        key={left + delay + duration}
        className={styles.piece}
        style={
          {
            left,
            backgroundColor: color,
            '--x-duration': duration,
            '--x-delay': delay,
            '--x-drift': drift,
            '--x-spin': spin,
          } as CSSProperties
        }
      />
    ))}
  </div>
);
