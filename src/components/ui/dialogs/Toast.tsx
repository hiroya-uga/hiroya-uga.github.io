'use client';

import { TRANSITION_DURATION } from '@/constants/css';
import { usePortal } from '@/hooks/use-portal';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { DIALOG_TOAST_PORTAL_ID } from '@/constants/id';

interface ToastItem {
  id: number;
  message: string;
  hidden: boolean;
}

type SetItems = Dispatch<SetStateAction<ToastItem[]>>;
type TimeoutIds = Map<number, Set<number>>;

const addTimeoutId = ({ id, timeoutId, timeoutIds }: { id: number; timeoutId: number; timeoutIds: TimeoutIds }) => {
  const ids = timeoutIds.get(id) ?? new Set<number>();
  ids.add(timeoutId);
  timeoutIds.set(id, ids);
};

const clearTimeoutIds = ({ id, timeoutIds }: { id: number; timeoutIds: TimeoutIds }) => {
  for (const timeoutId of timeoutIds.get(id) ?? []) {
    clearTimeout(timeoutId);
  }
  timeoutIds.delete(id);
};

const removeAfterTransition = ({
  id,
  setItems,
  timeoutIds,
}: {
  id: number;
  setItems: SetItems;
  timeoutIds: TimeoutIds;
}) => {
  const removeTimeoutId = window.setTimeout(() => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    timeoutIds.delete(id);
  }, TRANSITION_DURATION);
  addTimeoutId({ id, timeoutId: removeTimeoutId, timeoutIds });
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
  timeoutIds: TimeoutIds;
}) => {
  const hideTimeoutId = window.setTimeout(() => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, hidden: true } : item)));
    removeAfterTransition({ id, setItems, timeoutIds });
  }, duration);
  addTimeoutId({ id, timeoutId: hideTimeoutId, timeoutIds });
};

// クリックによる即時ディスミス。フェード待ちはせず、保留中のタイマーを打ち切って即座に取り除く
const dismiss = ({ id, setItems, timeoutIds }: { id: number; setItems: SetItems; timeoutIds: TimeoutIds }) => {
  clearTimeoutIds({ id, timeoutIds });
  setItems((prev) => prev.filter((item) => item.id !== id));
};

interface Props {
  message: string;
  setMessage: (_: string) => void;
  duration?: number;
  /** 実績解除など、即座に読み上げさせたい通知に指定する。role="alert" で aria-live="assertive" 相当にする */
  assertive?: boolean;
}

export const Toast = ({ message, setMessage, duration = 3000, assertive = false }: Readonly<Props>) => {
  const { renderDialog } = usePortal(DIALOG_TOAST_PORTAL_ID);
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timeoutIds = useRef<TimeoutIds>(new Map());
  const ref = useRef<HTMLDivElement>(null);

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
      for (const timeoutIdsForItem of ids.values()) {
        for (const timeoutId of timeoutIdsForItem) {
          clearTimeout(timeoutId);
        }
      }
    };
  }, []);

  return renderDialog(
    <div ref={ref} role={assertive ? 'alert' : 'status'} aria-atomic="false" className="space-y-2">
      {items.map((item) => (
        <p
          key={item.id}
          // 100% + 20px は scrollbar-gutter: stable; の時にモーダルダイアログを表示するとチラチラToastが見えてしまう問題の回避
          className="no-hidden animate-toast-in [[hidden]]:pointer-events-none last:[[hidden]]:opacity-0 pointer-events-auto ml-auto w-fit transition-opacity delay-100 ease-out [box-shadow:1px_2px_6px_#00000099]"
          style={{
            transitionDuration: `${TRANSITION_DURATION}ms`,
          }}
          hidden={item.hidden}
        >
          <button
            type="button"
            className="border-l-link bg-secondary block w-fit rounded-l border-l-8 px-4 py-2 pr-6 text-left"
            onClick={() => {
              dismiss({ id: item.id, setItems, timeoutIds: timeoutIds.current });
            }}
            title="この通知を閉じる"
          >
            {item.message}
          </button>
        </p>
      ))}
    </div>,
  );
};
