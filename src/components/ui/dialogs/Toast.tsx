'use client';

import { TRANSITION_DURATION } from '@/constants/css';
import { useDialog } from '@/hooks/use-dialog';
import clsx from 'clsx';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import styles from './Toast.module.css';

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
  /** モーダルダイアログの上に重ねて表示したい場合に指定する。要素をトップレイヤーへ昇格させる */
  popover?: boolean;
}

export const Toast = ({ message, setMessage, duration = 3000, popover = false }: Readonly<Props>) => {
  const { renderDialog } = useDialog();
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timeoutIds = useRef(new Set<number>());
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
      for (const id of ids) {
        clearTimeout(id);
      }
    };
  }, []);

  // items が空になるまでトップレイヤーに乗せ続ける。表示中に showPopover() を呼ぶと例外になるため既存の開閉状態を見て判定する
  useEffect(() => {
    if (popover === false) {
      return;
    }

    const dialog = ref.current;

    if (dialog === null) {
      return;
    }

    if (items.length === 0) {
      if (dialog.matches(':popover-open')) {
        dialog.hidePopover();
      }
      return;
    }

    if (dialog.matches(':popover-open') === false) {
      dialog.showPopover();
    }
  }, [items, popover]);

  return renderDialog(
    <div
      ref={ref}
      role="status"
      aria-atomic="false"
      className={clsx(styles.root, 'z-toast pointer-events-none space-y-2')}
      popover={popover ? 'manual' : undefined}
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
