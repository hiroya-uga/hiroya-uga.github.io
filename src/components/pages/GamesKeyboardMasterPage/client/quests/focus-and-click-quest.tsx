'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { isKeyboardActivatedClick } from '@/utils/keyboard';
import type { NodeQuest, QuestNodeProps } from './types';

const FocusAndClickQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  return (
    <p className="text-lg">
      この文章の中にある
      <a
        href="#"
        onClick={(e) => {
          // href="#" はフォーカス可能にするためだけの指定なので、ページ先頭へのジャンプは止める
          e.preventDefault();

          if (isKeyboardActivatedClick(e) === false) {
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
    'リンクはEnterキーで開ける作りが一般的。ボタンはSpaceでも押せるものが多いけど、リンクはSpaceでは開かないことが多い（ページがスクロールするだけの場合もある）。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: FocusAndClickQuestNode,
};
