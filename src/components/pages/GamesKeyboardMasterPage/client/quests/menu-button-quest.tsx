'use client';

import { DEFAULT_OPERATION_QUEST_TIMEOUT } from '@/components/pages/GamesKeyboardMasterPage/constants';
import { useEffect, useId, useRef, useState } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const MENU_ITEMS = ['新規作成', '開く', '保存', '名前を付けて保存', '閉じる'];
const MENU_ANSWER = '保存';

const MenuButtonQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 項目ごとに実フォーカスを移す方式。開いた直後と ↑↓ で項目が変わるたびにフォーカスを追従させる
  useEffect(() => {
    if (isOpen) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const openMenu = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="grid w-fit gap-1">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className="border-primary px-16PX py-8PX rounded border text-xl"
        onClick={() => {
          if (isOpen) {
            closeMenu();
            return;
          }

          openMenu(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openMenu(0);
            return;
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault();
            openMenu(MENU_ITEMS.length - 1);
          }
        }}
      >
        ファイル
      </button>

      {isOpen && (
        <ul
          id={menuId}
          role="menu"
          aria-label="ファイル"
          className="border-primary overflow-hidden rounded border text-xl"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((current) => (current + 1) % MENU_ITEMS.length);
              return;
            }

            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((current) => (current + MENU_ITEMS.length - 1) % MENU_ITEMS.length);
              return;
            }

            if (e.key === 'Home') {
              e.preventDefault();
              setActiveIndex(0);
              return;
            }

            if (e.key === 'End') {
              e.preventDefault();
              setActiveIndex(MENU_ITEMS.length - 1);
              return;
            }

            // Tab で開いたまま外へ出ると、消える項目からフォーカスが落ちるので、ボタンへ戻して閉じる
            if (e.key === 'Escape' || e.key === 'Tab') {
              e.preventDefault();
              closeMenu();
            }
          }}
        >
          {MENU_ITEMS.map((item, index) => (
            <li key={item} role="none">
              <button
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="focus:bg-secondary px-16PX py-8PX block w-full text-left focus:font-bold"
                onClick={() => {
                  if (item === MENU_ANSWER) {
                    onClear();
                    return;
                  }

                  onFail();
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const menuButtonQuest: NodeQuest = {
  type: 'node',
  title: 'メニューを開いて「保存」を選べ',
  hint: 'ボタンにフォーカスを合わせて、EnterかSpaceか↓でメニューを開く。↑↓で項目を選び、Enterで決定する',
  explanation:
    'メニューボタンは、Enter・Space・↓のどれかで開ける。開いたら↑↓で項目を移動して、Enterで決定、Escapeで閉じる。リストと同じで、Tabキーは項目ひとつひとつには止まらない。',
  timeLimit: DEFAULT_OPERATION_QUEST_TIMEOUT,
  Node: MenuButtonQuestNode,
};
