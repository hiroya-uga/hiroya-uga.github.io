'use client';

import { useEffect, useId, useRef } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const DialogCloseQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const closedViaEscapeRef = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    // closedby="any" は React の DialogHTMLAttributes 型に未対応のため setAttribute で付与する
    dialog?.setAttribute('closedby', 'any');
    dialog?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="border-primary bg-secondary p-16PX fixed inset-0 m-auto rounded border text-xl"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          closedViaEscapeRef.current = true;
        }
      }}
      onClose={() => {
        // Escape 以外(閉じるボタン・背景クリックによる light-dismiss)は Fail
        if (closedViaEscapeRef.current) {
          closedViaEscapeRef.current = false;
          onClear();
          return;
        }

        onFail();
      }}
    >
      <p id={titleId}>Escape キーで閉じろ</p>
      <button
        type="button"
        className="border-primary mt-16PX px-16PX py-8PX mx-auto block rounded border"
        onClick={() => ref.current?.close()}
      >
        閉じる
      </button>
    </dialog>
  );
};

export const dialogCloseQuest: NodeQuest = {
  type: 'node',
  title: 'ダイアログを Escape キーで閉じろ',
  hint: 'Escape キーで閉じる。閉じるボタンや背景クリックは失敗になる',
  explanation:
    'ダイアログは Escape キー一発で閉じられる。閉じるボタンまでフォーカスを移動しなくていい。閉じるボタンや背景クリックはマウス前提の操作なので、このお題では Failed 扱いにしている。',
  Node: DialogCloseQuestNode,
};
