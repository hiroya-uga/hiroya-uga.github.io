'use client';

import { likesApi } from '@/api';
import { Toast } from '@/components/ui/dialogs/Toast';
import { useLocalStorage } from '@/hooks/use-storage';
import { setLocalStorage } from '@/utils/local-storage';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const MESSAGES = {
  limit: 'いいねの回数が上限に達しました。時間をおいてお試しください',
  error: 'いいねに失敗しました',
} as const;

// useLocalStorage は defaultValue の参照が変わると購読をやり直すため、レンダーごとに新しい配列を渡さない
const NOT_LIKED: string[] = [];

interface Props {
  name: string;
}

export const LikeButton = ({ name }: Props) => {
  const liked = useLocalStorage('liked', {
    defaultValue: NOT_LIKED,
  });
  // 通信中も押下済みに見せるための楽観的な状態。localStorage へは成功時にだけ書く
  const [isPending, setIsPending] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const pressed = isPending || liked.includes(name);

  useEffect(() => {
    void likesApi.fetchCounts().then((counts) => {
      setCount(counts === null ? null : (counts[name] ?? 0));
    });
  }, [name]);

  const onClick = async () => {
    if (pressed) {
      return;
    }

    setIsPending(true);

    const result = await likesApi.increment(name);

    if (result === 'success') {
      setCount((prev) => (prev === null ? prev : prev + 1));
    }

    // duplicate は記録を消した後の再押下など。サーバーが加算していないため、件数は動かさず押下済みだけ揃える
    if (result === 'success' || result === 'duplicate') {
      setLocalStorage('liked', [...liked, name]);
    }

    if (result === 'limit' || result === 'error') {
      setMessage(MESSAGES[result]);
    }

    setIsPending(false);
  };

  const isLoading = count === null;

  return (
    <>
      <button
        type="button"
        className={clsx([
          'bg-secondary hover:bg-panel-primary-hover shadow-sticky text-high-contrast pl-14PX pr-10PX gap-x-4PX border-primary pt-4PX pb-3PX grid grid-cols-[auto_auto] items-center rounded-full border transition-[background-color,opacity,visibility]',
          isLoading && 'invisible opacity-0',
        ])}
        aria-label={`いいねする（${count}件のいいね）`}
        aria-pressed={pressed}
        onClick={onClick}
      >
        <span aria-hidden="true" title="いいねする">
          {pressed ? '♥' : '♡'}
        </span>
        <span aria-hidden="true" className="text-12px min-w-[2ch] tabular-nums">
          {count ?? '0'}
        </span>
      </button>
      <Toast message={message} setMessage={setMessage} />
    </>
  );
};
