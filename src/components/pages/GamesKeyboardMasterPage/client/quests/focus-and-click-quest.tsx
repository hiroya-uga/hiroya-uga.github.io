'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from './config';
import { NodeQuest, QuestNodeProps } from './types';

const FocusAndClickQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <p className="text-lg">
      この文章の中にある
      <a
        href="#"
        onClick={(e) => {
          // href="#" はフォーカス可能にするためだけの指定なので、ページ先頭へのジャンプは止める
          e.preventDefault();

          // detail === 0 はキーボード操作(Enter)経由のクリックのみを通す
          if (e.detail !== 0) {
            return;
          }

          onClear();
        }}
      >
        テキストリンク
      </a>
      にフォーカスしてクリックしてください。
    </p>
  );
};

export const focusAndClickQuest: NodeQuest = {
  type: 'node',
  title: 'テキストリンクにTabキーでフォーカスしてEnterで開け',
  hint: 'リンクにフォーカスを合わせて、Enterを押す',
  explanation:
    'リンクはEnterキーで開ける。ボタンはSpaceでも押せるけど、リンクはSpaceでは開けない（ページがスクロールするだけ）。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: FocusAndClickQuestNode,
};
