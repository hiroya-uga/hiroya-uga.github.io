'use client';

import { useEffect } from 'react';
import { MODIFIER_KEYS, Quest } from '../quests';

const MODIFIER_SINGLE_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

interface Props {
  isActive: boolean;
  quest: Quest;
  onClear: () => void;
  onFail: () => void;
}

/** キー入力型のお題の正誤を keydown で判定する。key 型以外のお題では何もしない */
export const useKeyQuest = ({ isActive, quest, onClear, onFail }: Props) => {
  useEffect(() => {
    if (isActive === false || quest.type !== 'key') {
      return;
    }

    const { key, modifiers = [] } = quest;

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiersMatch = MODIFIER_KEYS.every((modifier) => modifiers.includes(modifier) === e[modifier]);

      if (e.key === key && modifiersMatch) {
        // Shift+Tab のようなブラウザ標準動作を持つ組み合わせがフォーカストラップを壊さないよう止める
        e.preventDefault();
        onClear();
        return;
      }

      // 修飾キー単体はコンボの途中操作、Escape は長押し中断機能と競合するため Fail 判定から除外する
      if (MODIFIER_SINGLE_KEYS.has(e.key) || e.key === 'Escape') {
        return;
      }

      onFail();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, quest, onClear, onFail]);
};
