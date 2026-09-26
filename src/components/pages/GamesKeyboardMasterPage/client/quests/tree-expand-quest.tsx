'use client';

import { DEFAULT_LONG_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useRef, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

interface TreeNode {
  id: string;
  label: string;
  parentId: string | null;
}

interface VisibleItem extends TreeNode {
  depth: number;
  hasChildren: boolean;
  setSize: number;
  position: number;
}

const NODES: TreeNode[] = [
  { id: 'documents', label: '書類', parentId: null },
  { id: 'report', label: '報告書', parentId: 'documents' },
  { id: 'pictures', label: '画像', parentId: null },
  { id: 'travel', label: '旅行', parentId: 'pictures' },
  { id: 'fuji', label: '富士山', parentId: 'travel' },
  { id: 'music', label: '音楽', parentId: null },
];
const TARGET_ID = 'fuji';

// 開いているフォルダの子だけを、表示順に平坦化する。フラットな treeitem でも aria-level などで階層は伝えられる
const getVisibleItems = (expandedIds: Set<string>, parentId: string | null = null, depth = 0): VisibleItem[] => {
  const siblings = NODES.filter((node) => node.parentId === parentId);

  return siblings.flatMap((node, index) => {
    // 子を持たないノードは展開できないので、フォルダ相当の振る舞い(aria-expanded・→ での展開)を与えない
    const hasChildren = NODES.some((child) => child.parentId === node.id);
    const item: VisibleItem = { ...node, depth, hasChildren, setSize: siblings.length, position: index + 1 };

    return expandedIds.has(node.id) ? [item, ...getVisibleItems(expandedIds, node.id, depth + 1)] : [item];
  });
};

const TreeExpandQuestNode = ({ onClear }: Readonly<QuestNodeProps>) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState(NODES[0].id);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const items = getVisibleItems(expandedIds);

  const focusItem = (id: string) => {
    setFocusedId(id);
    itemRefs.current[id]?.focus();

    if (TARGET_ID === id) {
      onClear();
    }
  };

  const setExpanded = (id: string, expanded: boolean) => {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  return (
    <ul role="tree" aria-label="ファイル" className="grid gap-1 text-xl">
      {items.map((item, index) => {
        const isExpanded = expandedIds.has(item.id);

        return (
          <li
            key={item.id}
            role="treeitem"
            aria-level={item.depth + 1}
            aria-setsize={item.setSize}
            aria-posinset={item.position}
            aria-expanded={item.hasChildren ? isExpanded : undefined}
            // フォーカス中の項目だけが Tab キーの停止位置になる。他の項目へは矢印キーで移る
            tabIndex={item.id === focusedId ? 0 : -1}
            style={{ paddingInlineStart: `${item.depth * 1.5}rem` }}
            className="py-4PX rounded"
            ref={(element) => {
              itemRefs.current[item.id] = element;
            }}
            onFocus={(e) => {
              // 入れ子の項目からバブリングしてくるフォーカスは無視する
              if (e.target === e.currentTarget) {
                setFocusedId(item.id);
              }
            }}
            onClick={() => {
              focusItem(item.id);

              if (item.hasChildren) {
                setExpanded(item.id, isExpanded === false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusItem(items[Math.min(index + 1, items.length - 1)].id);
                return;
              }

              if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusItem(items[Math.max(index - 1, 0)].id);
                return;
              }

              if (e.key === 'Home') {
                e.preventDefault();
                focusItem(items[0].id);
                return;
              }

              if (e.key === 'End') {
                e.preventDefault();
                focusItem(items[items.length - 1].id);
                return;
              }

              if (e.key === 'ArrowRight') {
                e.preventDefault();

                if (item.hasChildren === false) {
                  return;
                }

                // 開いていて子を持つなら、直後の項目は必ず最初の子になる
                if (isExpanded) {
                  focusItem(items[index + 1].id);
                  return;
                }

                setExpanded(item.id, true);
                return;
              }

              if (e.key === 'ArrowLeft') {
                e.preventDefault();

                if (item.hasChildren && isExpanded) {
                  setExpanded(item.id, false);
                  return;
                }

                if (item.parentId !== null) {
                  focusItem(item.parentId);
                }
              }
            }}
          >
            <span aria-hidden="true">{item.hasChildren ? (isExpanded ? '▼' : '▶') : '　'}</span>
            {item.label}
          </li>
        );
      })}
    </ul>
  );
};

export const treeExpandQuest: NodeQuest = {
  type: 'node',
  title: 'ツリーを矢印キーで開いて、「富士山」まで移動しろ',
  hint: 'ツリーにフォーカスを合わせて、→でフォルダを開き、↓で下の項目へ移る',
  explanation:
    'ツリーは、Tabキーでツリーに入って、↑↓で表示中の項目を移動する作りが一般的。閉じたフォルダで→を押すと開き、開いたフォルダで→を押すと最初の子へ進む。←は開いたフォルダを閉じるか、親へ戻る、という実装が多い。',
  timeLimit: DEFAULT_LONG_OPERATION_QUEST_TIMEOUT,
  Node: TreeExpandQuestNode,
};
