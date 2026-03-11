import { SvgIcon } from '@/components/Icons';
import { useCopyButton } from '@/hooks/use-copy-button';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { useMemo } from 'react';
import { getCommandDescriptionNodes, getCommandNodes } from './utils';

type Props = {
  formState: SlackReminder.FormState;
};

export const PreviewAndResult = ({ formState }: Props) => {
  const result = useMemo<SlackReminder.Result>(() => getCommandNodes(formState), [formState]);

  const { handleClickCopyButton } = useCopyButton();

  return (
    <>
      <div className="mb-2 px-1 pt-14">
        <h2 className="mb-1 font-bold">出力結果：</h2>
        <p className="whitespace-pre-wrap">{getCommandDescriptionNodes({ result, type: formState.type })}</p>
      </div>
      <div className="@w640:sticky @w640:bottom-0 @w640:z-10 pb-4">
        <div className="@w640:shadow-sticky @w640:grid @w640:grid-cols-[1fr_auto] rounded-lg border border-transparent dark:border-slate-500">
          <p
            className="@w640:rounded-l-lg @w640:rounded-r-none whitespace-pre-wrap rounded-t-lg bg-gray-800 p-4 font-mono text-xs text-gray-300"
            onClick={(e) => {
              globalThis.window.getSelection()?.removeAllRanges();
              const range = document.createRange();
              range.selectNodeContents(e.currentTarget);
              globalThis.window.getSelection()?.addRange(range);
            }}
          >
            <span className="text-blue-400">/remind</span> <span className="text-red-300">{result.who || 'me'}</span>{' '}
            <span className="text-orange-300">"{result.message || 'ここにメッセージ'}"</span>{' '}
            {result.date && (
              <>
                <span className="text-[#b5cea8]">{result.date}</span>{' '}
                {result.every && (
                  <>
                    <span className="text-blue-400">{result.every}</span>{' '}
                  </>
                )}
              </>
            )}
            {result.day && (
              <>
                {result.every && (
                  <>
                    <span className="text-blue-400">{result.every}</span>{' '}
                  </>
                )}
                <span className="text-[#b5cea8]">{result.day}</span>{' '}
              </>
            )}
            <span className="text-red-300">at {result.time || '9:00'}</span>
            <span className="text-purple-300">{result.starting && ` starting ${result.starting}`}</span>
          </p>
          <p className="@w640:w-89px bg-tertiary @w640:rounded-l-none @w640:rounded-r-lg grid rounded-b-lg text-xs">
            <button
              type="button"
              className="hover:bg-(--v-color-background-tertiary-hover) bg-(--v-color-background-tertiary) grid grid-cols-[1rem_auto] items-center justify-center gap-1 rounded-r-lg p-3 transition-colors"
              onClick={(e) => {
                const label = e.currentTarget.lastElementChild;
                const value = e.currentTarget.parentElement?.previousElementSibling?.textContent?.trim() ?? '';

                if (label instanceof HTMLElement === false) {
                  return;
                }

                handleClickCopyButton(value, label);
              }}
            >
              <span className="relative block size-4">
                <SvgIcon name="copy" alt="" />
              </span>
              <span className="font-bold leading-4" aria-live="polite" title="出力結果をコピー">
                Copy
              </span>
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
