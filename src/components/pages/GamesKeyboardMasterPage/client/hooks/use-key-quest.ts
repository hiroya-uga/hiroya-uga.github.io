'use client';

import { useEffect, useRef, useState } from 'react';
import { MODIFIER_KEYS, Quest } from '../quests';

const MODIFIER_SINGLE_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

interface Props {
  quest: Quest;
  onClear: () => void;
  onFail: () => void;
}

/** キー入力型のお題の正誤を keydown で判定する。key 型以外のお題では何もしない */
export const useKeyQuest = ({ quest, onClear, onFail }: Props) => {
  // effect 内のローカル変数だと、onClear / onFail の identity が変わるたびに途中経過が消えるため ref で持つ。
  // 表示側へ渡す再描画用の state は ref とは別に持つ(ref の変更だけでは再描画されない)
  const pressedKeysRef = useRef(new Set<string>());
  const [pressedKeys, setPressedKeys] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    pressedKeysRef.current.clear();
    setPressedKeys(new Set());
  }, [quest]);

  useEffect(() => {
    if (quest.type !== 'key') {
      return;
    }

    const { key, modifiers = [] } = quest;

    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiersMatch = MODIFIER_KEYS.every((modifier) => modifiers.includes(modifier) === e[modifier]);

      if (Array.isArray(key)) {
        // 押しっぱなしのリピートで重複カウントされないよう、e.repeat は無視する
        if (e.repeat || !modifiersMatch || !key.includes(e.key)) {
          return;
        }

        e.preventDefault();
        pressedKeysRef.current.add(e.key);
        setPressedKeys(new Set(pressedKeysRef.current));

        if (key.every((k) => pressedKeysRef.current.has(k))) {
          onClear();
        }
        return;
      }

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
  }, [quest, onClear, onFail]);

  return { pressedKeys };
};
