'use client';

import { type RefObject, useEffect } from 'react';

interface Props {
  containerRef: RefObject<HTMLElement | null>;
}

// Tabで実際に辿り着ける要素だけを対象にする。disabled/tabIndex=-1は既定のTab移動でも読み飛ばされるため対象外
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(', ');

// セレクタに一致してもdisplay:noneで隠れている要素はTabで辿り着けないので、境界の的地から除く
const getFocusable = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => el.offsetParent !== null);

/**
 * コンテナの中だけでTab/Shift+Tabが循環するようにする。
 * 既定のTab移動が先頭・末尾を跨ごうとする瞬間だけ止めて反対側へ戻すので、コンテナ内部の並び順には干渉しない
 */
export const useFocusTrap = ({ containerRef }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      const container = containerRef.current;

      if (container === null || container.contains(document.activeElement) === false) {
        return;
      }

      const focusable = getFocusable(container);
      // Tabで辿れる要素が無いお題(keyタイプ等)は、コンテナ自身だけが唯一の的地になる
      const first = focusable.at(0) ?? container;
      const last = focusable.at(-1) ?? container;
      const isAtEdge = e.shiftKey ? document.activeElement === first : document.activeElement === last;

      if (isAtEdge === false) {
        return;
      }

      // 既定のTab移動でコンテナの外へ出る直前なので、反対側の端へ戻して外に出さない
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    };

    // 既定のTab移動が実行される前に境界かどうかを判定したいので、bubbleではなくcaptureで拾う
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [containerRef]);
};
