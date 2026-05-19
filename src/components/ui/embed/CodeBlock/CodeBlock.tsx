'use client';

import clsx from 'clsx';
import { type BundledLanguage, codeToHtml } from 'shiki';

import { Toast } from '@/components/ui/dialogs/Toast';
import { useCopyButton } from '@/hooks/use-copy-button';
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs';
import { useEffect, useId, useState } from 'react';
import styles from './CodeBlock.module.css';

interface BaseProps {
  code: string;
  language: BundledLanguage;
  className?: string;
  nowrap?: boolean;
  copyButton?: true;
}

interface CopyButtonProps {
  title?: string;
  code: string;
  withPlatformSwitcher?: boolean;
  'aria-describedby'?: string;
}

const CopyButton = ({ title = '', code, withPlatformSwitcher, 'aria-describedby': id }: Readonly<CopyButtonProps>) => {
  const { handleClickCopyButton } = useCopyButton();
  const [toastMessage, setToastMessage] = useState('');
  const [isJa, setIsJa] = useState(false);

  useEffect(() => {
    setIsJa(document.documentElement.lang === 'ja');
  }, []);

  const label = isJa ? (title || `${code.slice(0, 8)}...`) + 'をコピー' : 'Copy ' + (title || `${code.slice(0, 8)}...`);

  return (
    <>
      <button
        className={clsx([
          'ml-auto rounded border border-slate-400 bg-slate-200 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white',
          withPlatformSwitcher && 'mb-8px',
        ])}
        aria-label={label}
        onClick={(e) => {
          setToastMessage((title || `${code.slice(0, 8)}...`) + (isJa ? 'をコピーしました！' : ' has been copied!'));
          handleClickCopyButton(code, e.currentTarget);
          globalThis.window.gtag?.('event', 'click_copy_button');
        }}
        aria-describedby={id}
      >
        Copy
      </button>
      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};

type Props =
  | BaseProps
  | (BaseProps & {
      title: string;
      withPlatformSwitcher?: boolean;
    });

export const CodeBlock = ({ code, className, language = 'html', nowrap, ...restProps }: Readonly<Props>) => {
  const [html, setHtml] = useState('');
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
      className={clsx([styles.root, 'text-sm', nowrap === true ? 'whitespace-pre' : 'whitespace-pre-wrap', className])}
      dangerouslySetInnerHTML={{
        __html: html ? html : `<pre><code>${escapeHtml(code)}</code></pre>`,
      }}
    />
  );

  if ('title' in restProps) {
    return (
      <figure
        className={clsx([
          '@container',
          restProps.withPlatformSwitcher ||
            'overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700',
        ])}
      >
        <figcaption
          className={clsx([
            '@w240:grid @w240:gap-1.5 rounded-t-lg border-b border-slate-200 bg-slate-100 px-3 dark:border-slate-700 dark:bg-slate-800',

            restProps.withPlatformSwitcher && '@w240:grid-cols-[1fr_auto] pt-2',
            restProps.withPlatformSwitcher ||
              '@w240:grid-cols-[.75rem_1fr_auto] @w240:items-center @w240:before:inline-block @w240:before:size-3 @w240:before:rounded-full @w240:before:bg-red-400 py-2.5',
          ])}
        >
          <span
            className={clsx([
              '@w240:mb-0 mb-2 block',
              restProps.withPlatformSwitcher && 'pb-8px',
              restProps.withPlatformSwitcher ||
                '@w240:grid @w240:grid-cols-[.75rem_1fr] @w240:items-center @w240:gap-1.5 @w240:before:inline-block @w240:before:size-3 @w240:before:rounded-full @w240:before:bg-yellow-400',
            ])}
          >
            <span
              className={clsx([
                'text-xs text-[#4a535f] dark:text-[#9eb4da]',
                restProps.withPlatformSwitcher ||
                  '@w240:grid @w240:grid-cols-[.75rem_1fr] @w240:items-center @w240:gap-2 @w240:before:inline-block @w240:before:size-3 @w240:before:rounded-full @w240:before:bg-green-400',
              ])}
              id={id}
            >
              {restProps.title || language}
            </span>
          </span>
          {restProps.copyButton && (
            <CopyButton
              title={restProps.title}
              code={code}
              withPlatformSwitcher={restProps.withPlatformSwitcher}
              aria-describedby={id}
            />
          )}
        </figcaption>

        {codeBlock}
      </figure>
    );
  }

  return (
    <div
      className={clsx([
        'group relative overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700',
      ])}
    >
      {restProps.copyButton && (
        <p className="px-12px absolute right-0 top-0 col-start-2 row-start-1 bg-white py-3 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 dark:bg-[#24292e]">
          <CopyButton code={code} />
        </p>
      )}

      <div className={clsx([nowrap === true ? 'overflow-auto whitespace-pre' : 'whitespace-pre-wrap'])}>
        {codeBlock}
      </div>
    </div>
  );
};
