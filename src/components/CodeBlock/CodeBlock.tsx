'use client';

import clsx from 'clsx';
import { type BundledLanguage, codeToHtml } from 'shiki';

import { useEffect, useState } from 'react';
import styles from './CodeBlock.module.css';

type Props = {
  code: string;
  language: BundledLanguage;
  className?: string;
  nowrap?: boolean;
};

export const CodeBlock = ({ code, className, language = 'html', nowrap }: Props) => {
  const [html, setHtml] = useState('');

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

  return (
    <div
      className={clsx([
        styles.root,
        'rounded text-sm',
        nowrap === true ? 'whitespace-pre' : 'whitespace-pre-wrap',
        className,
      ])}
      dangerouslySetInnerHTML={{
        __html: html ? html : `<pre><code>${code}</code></pre>`,
      }}
    />
  );
};
