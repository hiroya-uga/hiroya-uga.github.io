'use client';

import { likesApi } from '@/api';
import { Toast, useToast } from '@/components/ui/dialogs/Toast';
import { useAchievement } from '@/hooks/use-achievement';
import { useLocalStorage } from '@/hooks/use-storage';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useId, useRef, useState, type CSSProperties } from 'react';
import styles from './LikeButton.module.css';

const MESSAGES = {
  limit: 'いいねの回数が上限に達しました。時間をおいてお試しください',
  error: 'いいねに失敗しました',
} as const;

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
  const toastProps = useToast();
  const { toastProps: achievementToastProps, unlock } = useAchievement();

  const isCountRequestingRef = useRef(false);

  const [count, setCount] = useState<number | null>(null);

  const [isPending, setIsPending] = useState(false);
  const [isLikedSuccess, setIsLikedSuccess] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isThanksTransitionEnd, setIsThanksTransitionEnd] = useState(false);

  const { isReady, value: localStorageValue } = useLocalStorage('liked');

  const liked = localStorageValue ?? NOT_LIKED;
  const isAlreadyLiked = liked.includes(target);
  const pressed = isPending || isAlreadyLiked;
  const shouldShowThanksMessage = isPending || isLikedSuccess;

  const postIncrement = async () => {
    setIsPending(true);

    const result = await likesApi.increment(target);

    switch (result.status) {
      case 'success':
        setIsLikedSuccess(true);
        setParticles(createParticles());
        unlock('thank-you-for-liking');
      case 'duplicate': {
        // 直前に読み直して他タブの記録を消さないようにする
        const latest = getLocalStorage('liked') ?? NOT_LIKED;

        setLocalStorage('liked', latest.includes(target) ? latest : [...latest, target]);

        break;
      }

      case 'limit':
      case 'error':
        toastProps.setMessage(MESSAGES[result.status]);
        break;
      default:
        result.status satisfies never;
    }

    if (typeof result.count === 'number') {
      setCount(result.count);
    }

    setIsPending(false);
  };

  const labelledby = `labelledby-${id}`;
  const describedby1 = `describedby-${id}-status`;
  const describedby2 = `describedby-${id}-count`;

  const handleFetchCount = isAlreadyLiked
    ? () => {
        // 確定済みの件数をキャッシュされた /counts で上書きしない。取得中はホバーとフォーカスが同時に発火しうるため、通信を1回にまとめる
        if (count !== null || isCountRequestingRef.current) {
          return;
        }

        isCountRequestingRef.current = true;

        void likesApi.fetchCounts().then((counts) => {
          if (counts === null) {
            isCountRequestingRef.current = false;

            return;
          }

          setCount(counts[target] ?? 0);
        });
      }
    : undefined;

  return (
    <>
      <span
        className={clsx([
          'bg-secondary shadow-sticky text-high-contrast border-primary group relative isolate grid grid-cols-[auto_auto_auto] items-center rounded-full border transition-[background-color,opacity,visibility] contain-layout',
          !isReady && 'invisible opacity-0',
          pressed ? '' : 'hover:bg-panel-primary-hover',
        ])}
        onPointerEnter={handleFetchCount}
        onFocus={handleFetchCount}
      >
        <button
          type="button"
          aria-labelledby={labelledby}
          aria-describedby={pressed && count !== null ? [describedby1, describedby2].join(' ') : undefined}
          aria-pressed={pressed}
          onClick={(e) => {
            e.currentTarget.focus();

            if (pressed) {
              return;
            }

            void postIncrement();
          }}
          title={pressed ? 'いいね済み' : undefined}
          className="focus-visible:before:focus-ring size-40px select-none before:absolute before:inset-0 before:m-auto before:rounded-full focus-visible:outline-none"
        >
          <span className={clsx(['z-1 relative top-[-0.2ex] block', !pressed && styles.outline])}>👍</span>
          <span className="sr-only" id={labelledby}>
            いいねする
          </span>
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 before:invisible before:content-['👍'] motion-reduce:opacity-0">
            {particles.map(({ angle, distance, duration, delay }) => (
              <span
                key={angle}
                className={clsx([styles.particle, 'absolute left-0 top-0 opacity-0'])}
                style={
                  {
                    '--x-angle': `${angle}deg`,
                    '--x-distance': `${distance}px`,
                    '--x-duration': `${duration}ms`,
                    '--x-delay': `${delay}ms`,
                  } as CSSProperties
                }
              >
                👍
              </span>
            ))}
          </span>
        </button>
        <span
          className={clsx([
            'text-12px block max-w-0 overflow-clip whitespace-nowrap font-bold transition-[max-width,padding-right]',
            pressed
              ? 'group-focus-within:max-w-[8rem] group-focus-within:pr-4 group-hover:max-w-[8rem] group-hover:pr-4 motion-reduce:transition-none'
              : 'select-none',
            shouldShowThanksMessage && !isThanksTransitionEnd ? 'delay-300' : 'delay-0',
          ])}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'max-width') {
              setIsThanksTransitionEnd(true);
            }
          }}
        >
          {count === null ? null : (
            <>
              {shouldShowThanksMessage ? (
                <span id={describedby1}>
                  <span>Thank you!</span>
                  <span className="sr-only select-none">（いいね済み）</span>
                </span>
              ) : (
                <span id={describedby1}>いいね済み</span>
              )}
              <span className="pl-8PX">
                {count}
                <span className="sr-only select-none" id={describedby2}>
                  {`${count}件のいいね`}
                </span>
              </span>
            </>
          )}
        </span>
      </span>
      <Toast {...toastProps} assertive />
      <Toast {...achievementToastProps} />
    </>
  );
};
