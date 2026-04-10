import { SvgIcon } from '@/components/Icons';
import { useCopyButton } from '@/hooks/use-copy-button';

import type { SlackReminder } from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/config';
import { useEffect, useId, useMemo, useState } from 'react';
import { getCommandDescriptionNodes, getCommandNodes, parseMarkdownForSlack } from './utils';

import styles from '@/app/(ja)/(common)/tools/slack-reminder-command-generator/Client/parts/PreviewAndResult/PreviewAndResult.module.css';
import { Toast } from '@/components/Dialog';
import clsx from 'clsx';

type Props = {
  formState: SlackReminder.FormState;
  isEnableMarkdown: boolean;
};

export const PreviewAndResult = ({ formState, isEnableMarkdown }: Props) => {
  const id = useId();
  const startQuoteId = `${id}-start-quote`;
  const endQuoteId = `${id}-end-quote`;

  const result = useMemo<SlackReminder.Result>(() => getCommandNodes(formState), [formState]);

  const [toastMessage, setToastMessage] = useState('');

  const { handleClickCopyButton: handleClickPlainCopyButton } = useCopyButton({ mimeType: 'text/plain' });
  const { handleClickCopyButton: handleClickHtmlCopyButton } = useCopyButton({ mimeType: 'text/html' });

  const safeHtmlMessage = useMemo(() => {
    return parseMarkdownForSlack(result.message || 'ここにメッセージ');
  }, [result.message]);

  useEffect(() => {
    const start = document.getElementById(startQuoteId);
    const end = document.getElementById(endQuoteId);

    if (start === null || end === null) {
      return;
    }

    const cleanUp = () => {
      while (start && start?.nextSibling !== end) {
        start?.nextSibling?.remove();
      }
    };

    if (isEnableMarkdown === false) {
      start.insertAdjacentText('afterend', result.message || 'ここにメッセージ');
      return cleanUp;
    }

    start?.insertAdjacentHTML('afterend', safeHtmlMessage.trim().replaceAll(/>\n+</g, '><'));

    if (start?.nextElementSibling instanceof HTMLParagraphElement) {
      const span = document.createElement('span');
      span.dataset.slackMarkdown = 'true';

      for (const child of Array.from(start.nextElementSibling.childNodes)) {
        span.appendChild(child);
      }

      start.nextElementSibling.replaceWith(span);
    }

    if (end?.previousElementSibling instanceof HTMLParagraphElement) {
      const span = document.createElement('span');

      for (const child of Array.from(end.previousElementSibling.childNodes)) {
        span.appendChild(child);
      }

      end.previousElementSibling.replaceWith(span);

      if (start.nextElementSibling === end.previousElementSibling.previousElementSibling) {
        span.insertAdjacentText('beforebegin', '\n');
      }
    }

    return cleanUp;
  }, [safeHtmlMessage, isEnableMarkdown, result.message]);

  return (
    <>
      <div className="mb-2 px-1 pt-14">
        <h2 className="mb-1 font-bold">出力結果：</h2>
        <p className="whitespace-pre-wrap">
          {getCommandDescriptionNodes({ result, type: formState.type, isEnableMarkdown })}
        </p>
      </div>
      <div className="@w640:sticky @w640:bottom-0 @w640:z-10 pb-4">
        <div className="@w640:shadow-sticky @w640:grid @w640:grid-cols-[1fr_auto] rounded-lg border border-transparent dark:border-slate-500">
          <div
            className={clsx(
              styles.message,
              '@w640:rounded-l-lg @w640:rounded-r-none whitespace-pre-wrap rounded-t-lg bg-gray-800 p-4 font-mono text-xs text-orange-300',
            )}
            onClick={(e) => {
              globalThis.window.getSelection()?.removeAllRanges();
              const range = document.createRange();
              range.selectNodeContents(e.currentTarget);
              globalThis.window.getSelection()?.addRange(range);
            }}
          >
            <span className="text-blue-400">/remind</span> <span className="text-red-300">{result.who || 'me'}</span>{' '}
            <span className="text-orange-300" id={startQuoteId}>
              "
            </span>
            <span className="text-orange-300" id={endQuoteId}>
              "
            </span>{' '}
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
          </div>
          <p className="@w640:w-89px bg-tertiary @w640:rounded-l-none @w640:rounded-r-lg grid rounded-b-lg text-xs">
            <button
              type="button"
              className="hover:bg-(--x-color-background-tertiary-hover) bg-(--x-color-background-tertiary) grid grid-cols-[1rem_auto] items-center justify-center gap-1 rounded-r-lg p-3 transition-colors"
              onClick={(e) => {
                const labelElement = e.currentTarget.lastElementChild;
                const resultElement = e.currentTarget.parentElement?.previousElementSibling;

                if (resultElement instanceof HTMLElement === false || labelElement instanceof HTMLElement === false) {
                  return;
                }

                if (isEnableMarkdown) {
                  const div = document.createElement('div');
                  div.innerHTML = resultElement.innerHTML;
                  div.querySelectorAll<HTMLElement>('*').forEach((element) => {
                    element.removeAttribute('class');
                  });
                  handleClickHtmlCopyButton(
                    {
                      text: resultElement.textContent ?? '',
                      html: div.innerHTML,
                    },
                    labelElement,
                  ).then(() => {
                    setToastMessage('text/htmlをコピーしました！');
                  });
                } else {
                  handleClickPlainCopyButton(resultElement.textContent ?? '', labelElement).then(() => {
                    setToastMessage('コマンドテキストをコピーしました！');
                  });
                }
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

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};
