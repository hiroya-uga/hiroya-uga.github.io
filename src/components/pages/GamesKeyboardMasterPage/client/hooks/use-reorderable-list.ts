'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  initialItems: string[];
  // move() の setItems と同期的に確定した並びを見て判定したい呼び出し元向け(即座にクリア判定したいお題など)
  onAfterMove?: (next: string[], movedItem: string) => void;
}

/** リストの並び替えお題(list-reorder-*)で共通する、項目の移動とフォーカス復元を扱う */
export const useReorderableList = ({ initialItems, onAfterMove }: Props) => {
  const [items, setItems] = useState(initialItems);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusedItemRef = useRef<string | null>(null);

  // 並び替えで DOM ノードが付け替わるとフォーカスが外れるので、動かした項目へ戻す
  useEffect(() => {
    if (focusedItemRef.current === null) {
      return;
    }

    itemRefs.current.get(focusedItemRef.current)?.focus();
  }, [items]);

  const registerItemRef = (item: string) => (element: HTMLButtonElement | null) => {
    if (element === null) {
      itemRefs.current.delete(item);
      return;
    }

    itemRefs.current.set(item, element);
  };

  const focusItem = (item: string) => {
    focusedItemRef.current = item;
  };

  // 移動先が範囲外なら null を返す。移動できた場合は移動後のインデックス(0始まり)を返す
  const move = (item: string, offset: -1 | 1) => {
    const from = items.indexOf(item);
    const to = from + offset;

    if (0 > to || to >= items.length) {
      return null;
    }

    const next = [...items];
    next.splice(from, 1);
    next.splice(to, 0, item);

    focusedItemRef.current = item;
    setItems(next);
    onAfterMove?.(next, item);

    return to;
  };

  return { items, setItems, move, registerItemRef, focusItem };
};
