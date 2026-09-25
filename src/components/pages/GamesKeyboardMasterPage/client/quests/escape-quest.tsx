'use client';

import { useEffect, useRef } from 'react';
import { NodeQuest, QuestNodeProps } from './types';

const EscapeQuestNode = ({ onClear, onFail }: Readonly<QuestNodeProps>) => {
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
      <p>Escape キーで閉じろ</p>
      <button
        type="button"
        className="border-primary mt-16PX px-16PX py-8PX rounded border"
        onClick={() => ref.current?.close()}
      >
        閉じる
      </button>
    </dialog>
  );
};

export const escapeQuest: NodeQuest = {
  type: 'node',
  title: 'ダイアログを Escape キーで閉じろ',
  hint: '閉じるボタンや背景クリックは Fail や。Escape 一発で閉じろ',
  explanation:
    '実はダイアログ、Escape キー一発で閉じられる。背景クリックで閉じるのはマウス操作なので、このクエストでは Fail 扱いにしている。',
  Node: EscapeQuestNode,
};
