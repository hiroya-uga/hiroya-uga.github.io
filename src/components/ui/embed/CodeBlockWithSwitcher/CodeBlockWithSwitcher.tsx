'use client';

import { CodeBlock } from '@/components/ui/embed/CodeBlock';
import clsx from 'clsx';
import { ComponentProps, useId } from 'react';

import { useContentSwitcher } from '@/hooks/use-content-switcher';
import styles from './CodeBlockWithSwitcher.module.css';

type BundledLanguage = ComponentProps<typeof CodeBlock>['language'];

type BaseProps = {
  type?: 'platform' | 'language';
  codes: Record<string, string>;
  language: BundledLanguage | Record<string, BundledLanguage>;
  className?: string;
  nowrap?: boolean;
};

type Props = BaseProps | (BaseProps & { title: string; copyButton?: true });

const LABELS = {
  platform: 'プラットフォーム切替',
  language: '言語切替',
};

export const CodeBlockWithSwitcher = ({ type = 'platform', codes, language, ...codeBlockProps }: Readonly<Props>) => {
  const id = useId();
  const [selected, handleChange] = useContentSwitcher(type, Object.keys(codes));
  const resolvedLanguage = typeof language === 'string' ? language : language[selected];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-700">
      <div
        role="radiogroup"
        aria-label={LABELS[type]}
        className="animate-fade-in bg-(--border-color-primary) isolate grid w-full grid-cols-[auto_1fr_auto] items-center gap-1.5 overflow-auto px-3 before:inline-block before:size-3 before:rounded-full before:bg-red-400 dark:bg-slate-950"
      >
        <div className="flex items-center gap-1.5 before:inline-block before:size-3 before:rounded-full before:bg-yellow-400">
          <div className="flex items-center gap-2 text-xs text-[#4a535f] before:inline-block before:size-3 before:rounded-full before:bg-green-400 dark:text-[#9eb4da]">
            <ul className={clsx([styles.list, 'relative flex p-1 pb-0 text-center'])}>
              {Object.keys(codes).map((name) => (
                <li key={name} className="z-1 relative m-0 list-none p-0">
                  <label
                    className={clsx(
                      'text-primary block min-w-20 rounded border-none bg-none p-2 pb-2.5 text-xs leading-none',
                      selected === name || 'dark:text-[#9b9da6]',
                    )}
                  >
                    <input
                      type="radio"
                      name={id}
                      value={name}
                      checked={selected === name}
                      onChange={() => handleChange(name)}
                      className="absolute inset-0 -z-10 opacity-0"
                    />
                    {name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <CodeBlock {...codeBlockProps} language={resolvedLanguage} code={codes[selected]} withPlatformSwitcher />
    </div>
  );
};
