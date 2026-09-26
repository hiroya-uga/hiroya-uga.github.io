'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const LINK_LABELS = ['1つ目のリンク', '2つ目のリンク', '3つ目のリンク'];

const FocusQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <p className="text-lg">
      {LINK_LABELS.map((label, index) => (
        <span key={label}>
          <a
            href="#"
            onFocus={() => {
              if (index === LINK_LABELS.length - 1) {
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
          {index < LINK_LABELS.length - 1 && '、'}
        </span>
      ))}
    </p>
  );
};

export const focusQuest: NodeQuest = {
  type: 'node',
  title: '3つ目のテキストリンクにTabキーでフォーカスしろ',
  hint: 'Tabを押して、リンクを順番にたどる。SafariはOption+Tab',
  explanation:
    'リンクもボタンと同じく、Tabキーでひとつずつフォーカスできる。Safariは初期設定だとリンクを飛ばすので、Option+Tabを使うか、設定で切り替える。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: FocusQuestNode,
};
