'use client';

import { likesApi } from '@/api';
import { Toast } from '@/components/ui/dialogs/Toast';
import { useLocalStorage } from '@/hooks/use-storage';
import { setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useEffect, useId, useState, type CSSProperties } from 'react';
import styles from './LikeButton.module.css';

const MESSAGES = {
  limit: 'いいねの回数が上限に達しました。時間をおいてお試しください',
  error: 'いいねに失敗しました',
} as const;

// useLocalStorage は defaultValue の参照が変わると購読をやり直すため、レンダーごとに新しい配列を渡さない
const NOT_LIKED: string[] = [];

const PARTICLE_COUNT = 10;

interface Particle {
  angle: number;
  distance: number;
  duration: number;
  delay: number;
}

const createParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    angle: (360 / PARTICLE_COUNT) * index + Math.random() * 30 - 15,
    distance: 24 + Math.random() * 14,
    duration: 500 + Math.random() * 300,
    delay: Math.random() * 80,
  }));

interface Props {
  target: string;
}

export const LikeButton = ({ target }: Props) => {
  const id = useId();

  const liked = useLocalStorage('liked') ?? NOT_LIKED;
  // 通信中も押下済みに見せるための楽観的な状態。localStorage へは成功時にだけ書く
  const [isPending, setIsPending] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const pressed = isPending || liked.includes(target);

  useEffect(() => {
    void likesApi.fetchCounts().then((counts) => {
      setCount(counts === null ? null : (counts[target] ?? 0));
    });
  }, [target]);

  const postIncrement = async () => {
    setIsPending(true);

    const result = await likesApi.increment(target);

    if (result === 'success') {
      setCount((prev) => (prev === null ? prev : prev + 1));
    }

    // duplicate は記録を消した後の再押下など。サーバーが加算していないため、件数は動かさず押下済みだけ揃える
    if (result === 'success' || result === 'duplicate') {
      setLocalStorage('liked', [...liked, target]);
      setParticles(createParticles());
    }

    if (result === 'limit' || result === 'error') {
      setMessage(MESSAGES[result]);
    }

    setIsPending(false);
  };

  const isLoading = count === null;
  const labelledby = `labelledby-${id}`;
  const describedby1 = `describedby-${id}-status`;
  const describedby2 = `describedby-${id}-count`;

  return (
    <>
      <span
        className={clsx([
          'bg-secondary shadow-sticky text-high-contrast pl-14PX pr-12PX border-primary py-4PX group relative isolate grid grid-cols-[auto_auto_auto] items-center rounded-full border transition-[background-color,opacity,visibility] contain-layout',
          isLoading && 'invisible opacity-0',
          pressed ? '' : 'hover:bg-panel-primary-hover',
        ])}
      >
        <button
          type="button"
          aria-labelledby={labelledby}
          aria-describedby={[pressed ? describedby1 : '', describedby2].join(' ').trim()}
          aria-pressed={pressed}
          onClick={(e) => {
            e.currentTarget.focus();

            if (pressed) {
              return;
            }

            void postIncrement();
          }}
          title={pressed ? 'いいね済み' : 'いいねする'}
          className="focus-visible:before:focus-ring select-none before:absolute before:inset-0 before:m-auto before:rounded-full focus-visible:outline-none"
        >
          <span className="z-1 relative top-[-0.2ex] block">👍</span>
          <span className="sr-only" id={labelledby}>
            いいねする
          </span>
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 before:invisible before:content-['👍'] motion-reduce:opacity-0">
            {particles.map(({ angle, distance, duration, delay }) => (
              <span
                key={angle}
                className={clsx([styles.particle, "absolute left-0 top-0 opacity-0 before:content-['👍']"])}
                style={
                  {
                    '--x-angle': `${angle}deg`,
                    '--x-distance': `${distance}px`,
                    '--x-duration': `${duration}ms`,
                    '--x-delay': `${delay}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        </button>
        <span
          className={clsx([
            'text-12px ml-6PX block max-w-0 overflow-clip whitespace-nowrap font-bold transition-[max-width,padding-right]',
            pressed
              ? 'group-hover:pr-6PX group-focus-within:pr-6PX group-focus-within:max-w-[calc(4.5rem+6px)] group-hover:max-w-[calc(4.5rem+6px)] motion-reduce:transition-none'
              : 'select-none',
          ])}
          id={pressed ? describedby1 : undefined}
        >
          Thank you!
          <span className="sr-only select-none">（いいね済み）</span>
        </span>
        <span
          aria-hidden="true"
          className={clsx(['text-14px min-w-[2ch] text-center tabular-nums', pressed && 'font-bold'])}
          id={describedby2}
        >
          <span>{count ?? '0'}</span>
          <span className="sr-only select-none">件のいいね</span>
        </span>
      </span>
      <Toast message={message} setMessage={setMessage} />
    </>
  );
};
