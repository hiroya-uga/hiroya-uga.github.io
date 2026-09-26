'use client';

import { useRef } from 'react';
import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const LINK_LABELS = ['1つ目のリンク', '2つ目のリンク', '3つ目のリンク'];
const LAST_INDEX = LINK_LABELS.length - 1;
const RETURN_INDEX = LAST_INDEX - 1;

const FocusReverseQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  // 再描画は要らないので state にはしない
  const hasReachedLastRef = useRef(false);

  return (
    <p className="text-lg">
      {LINK_LABELS.map((label, index) => (
        <span key={label}>
          <a
            href="#"
            onFocus={() => {
              if (index === LAST_INDEX) {
                hasReachedLastRef.current = true;
                return;
              }

              // 3つ目に着くより前に2つ目を通過しただけではクリアにしない
              if (index === RETURN_INDEX && hasReachedLastRef.current) {
                onClear();
              }
            }}
            onClick={(e) => {
              // href="#" はフォーカス可能にするためだけの指定なので、ページ先頭へのジャンプは止める
              e.preventDefault();
            }}
          >
            {label}
          </a>
          {index < LAST_INDEX && '、'}
        </span>
      ))}
    </p>
  );
};

export const focusReverseQuest: NodeQuest = {
  type: 'node',
  title: '3つ目のリンクにフォーカスしてから、Shift + Tabで2つ目のリンクに戻れ',
  hint: 'Tabで3つ目のリンクまで進んで、Shift+Tabで1つ戻る',
  explanation: 'Shift+Tabで、Tabとは逆の順番にフォーカスを戻せる。行きすぎたときも、最初からやり直さずに1つ戻れる。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: FocusReverseQuestNode,
};
