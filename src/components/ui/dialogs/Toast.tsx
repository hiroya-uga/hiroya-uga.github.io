'use client';

import { TRANSITION_DURATION } from '@/constants/css';
import { useDialog } from '@/hooks/use-dialog';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

interface ToastItem {
  id: number;
  message: string;
  hidden: boolean;
}

type SetItems = Dispatch<SetStateAction<ToastItem[]>>;

const removeAfterTransition = ({
  id,
  setItems,
  timeoutIds,
}: {
  id: number;
  setItems: SetItems;
  timeoutIds: Set<number>;
}) => {
  const removeTimeoutId = window.setTimeout(() => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, TRANSITION_DURATION);
  timeoutIds.add(removeTimeoutId);
};

const hideAfterDuration = ({
  id,
  duration,
  setItems,
  timeoutIds,
}: {
  id: number;
  duration: number;
  setItems: SetItems;
  timeoutIds: Set<number>;
}) => {
  const hideTimeoutId = window.setTimeout(() => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, hidden: true } : item)));
    removeAfterTransition({ id, setItems, timeoutIds });
  }, duration);
  timeoutIds.add(hideTimeoutId);
};

interface Props {
  message: string;
  setMessage: (_: string) => void;
  duration?: number;
}

export const Toast = ({ message, setMessage, duration = 3000 }: Readonly<Props>) => {
  const { renderDialog } = useDialog();
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timeoutIds = useRef(new Set<number>());

  // message が渡されるたびにキューへ積む。表示中の他アイテムには影響しない。
  useEffect(() => {
    if (message === '') {
      return;
    }

    const id = nextId.current++;

    setItems((prev) => [...prev, { id, message, hidden: false }]);
    // 同一文字列の連投も新規アイテムとして検知できるよう即座にリセットする
    setMessage('');

    hideAfterDuration({
      id,
      duration,
      setItems,
      timeoutIds: timeoutIds.current,
    });
  }, [duration, message, setMessage]);

  useEffect(() => {
    const ids = timeoutIds.current;
    return () => {
      for (const id of ids) {
        clearTimeout(id);
      }
    };
  }, []);

  return renderDialog(
    <div
      role="status"
      aria-atomic="false"
      className="z-toast pointer-events-none fixed right-0 top-0 max-h-full w-full space-y-2 overflow-y-auto overflow-x-clip pt-4"
    >
      {items.map((item) => (
        <p
          key={item.id}
          // 100% + 20px は scrollbar-gutter: stable; の時にモーダルダイアログを表示するとチラチラToastが見えてしまう問題の回避
          className="no-hidden animate-toast-in bg-secondary border-l-link [[hidden]]:pointer-events-none last:[[hidden]]:opacity-0 pointer-events-auto ml-auto w-fit max-w-[min(300px,95%)] rounded-l border-l-8 px-4 py-2 pr-6 transition-opacity delay-100 ease-out [box-shadow:1px_2px_6px_#00000099]"
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
          hidden={item.hidden}
        >
          {item.message}
        </p>
      ))}
    </div>,
  );
};
