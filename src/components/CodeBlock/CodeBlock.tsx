'use client';

import clsx from 'clsx';
import { type BundledLanguage, codeToHtml } from 'shiki';

import { useCopyButton } from '@/hooks/use-copy-button';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { useEffect, useId, useState } from 'react';
import { Toast } from '../Dialog';
import styles from './CodeBlock.module.css';

interface BaseProps {
  code: string;
  language: BundledLanguage;
  className?: string;
  nowrap?: boolean;
}

type Props =
  | BaseProps
  | (BaseProps & {
      title: string;
      copyButton?: true;
    });

export const CodeBlock = ({ code, className, language = 'html', nowrap, ...restProps }: Props) => {
  const [html, setHtml] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const { handleClickCopyButton } = useCopyButton();
  const id = useId();

  useEffect(() => {
    codeToHtml(code, {
      lang: language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        {
          pre(node) {
            delete node.properties.tabindex;
          },
        },
      ],
    }).then(setHtml);
  }, [code, language]);

  if (code === '') {
    return null;
  }

  const codeBlock = (
    <div
      className={clsx([
        styles.root,
        'rounded text-sm',
        nowrap === true ? 'whitespace-pre' : 'whitespace-pre-wrap',
        className,
      ])}
      dangerouslySetInnerHTML={{
        __html: html ? html : `<pre><code>${escapeHtml(code)}</code></pre>`,
      }}
    />
  );

  if ('title' in restProps) {
    return (
      <figure className="rounded-t-lg border border-slate-200 shadow-sm dark:border-slate-700">
        <figcaption className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 rounded-t-lg border-b border-slate-200 bg-slate-100 px-3 py-2.5 before:inline-block before:size-3 before:rounded-full before:bg-red-400 dark:border-slate-700 dark:bg-slate-800">
          <span className="flex items-center gap-1.5 before:inline-block before:size-3 before:rounded-full before:bg-yellow-400">
            <span
              className="flex items-center gap-2 text-xs text-slate-400 before:inline-block before:size-3 before:rounded-full before:bg-green-400 dark:text-[#9eb4da]"
              id={id}
            >
              {restProps.title || language}
            </span>
          </span>
          {restProps.copyButton && (
            <>
              <button
                className="ml-auto rounded border border-slate-400 bg-slate-200 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
                onClick={(e) => {
                  setToastMessage(restProps.title + 'をコピーしました！');
                  handleClickCopyButton(code, e.currentTarget);
                  window.gtag?.('event', 'click_copy_button');
                }}
                aria-describedby={id}
              >
                Copy
              </button>
              <Toast message={toastMessage} setMessage={setToastMessage} />
            </>
          )}
        </figcaption>

        {codeBlock}
      </figure>
    );
  }

  return codeBlock;
};
