'use client';

import { CodeBlock } from '@/components/CodeBlock';
import clsx from 'clsx';
import { ComponentProps, useId } from 'react';
import { usePlatform } from './hooks';

import styles from './CodeBlockWithPlatfrom.module.css';

interface PlatformSectionProps {
  content: Record<string, React.ReactNode>;
}

export const PlatformSection = ({ content }: PlatformSectionProps) => {
  const [platform] = usePlatform();
  return <>{content[platform]}</>;
};

type BundledLanguage = ComponentProps<typeof CodeBlock>['language'];

type BaseProps = {
  codes: Record<string, string>;
  language: BundledLanguage | Record<string, BundledLanguage>;
  className?: string;
  nowrap?: boolean;
};

type Props = BaseProps | (BaseProps & { title: string; copyButton?: true });

export const CodeBlockWithPlatform = ({ codes, language, ...codeBlockProps }: Props) => {
  const id = useId();
  const [platform, handleChange] = usePlatform();
  const resolvedLanguage = typeof language === 'string' ? language : language[platform];

  return (
    <div className="overflow-hidden rounded-t-lg border border-slate-200 shadow-sm dark:border-slate-700">
      <div
        role="radiogroup"
        aria-label="言語切替"
        className="animate-fade-in bg-(--border-color-primary) isolate grid w-full grid-cols-[auto_1fr_auto] items-center gap-1.5 overflow-auto px-3 before:inline-block before:size-3 before:rounded-full before:bg-red-400 dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex items-center gap-1.5 before:inline-block before:size-3 before:rounded-full before:bg-yellow-400">
          <div className="flex items-center gap-2 text-xs text-[#4a535f] before:inline-block before:size-3 before:rounded-full before:bg-green-400 dark:text-[#9eb4da]">
            <ul className={clsx([styles.list, 'relative flex p-1 pb-0 text-center'])}>
              {Object.keys(codes).map((name) => (
                <li key={name} className="relative z-[1] m-0 list-none p-0">
                  <label
                    className={clsx('text-primary block min-w-20 rounded border-none bg-none p-2 text-xs leading-none')}
                  >
                    <input
                      type="radio"
                      name={id}
                      value={name}
                      checked={platform === name}
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
      <CodeBlock {...codeBlockProps} language={resolvedLanguage} code={codes[platform]} withPlatformSwitcher />
    </div>
  );
};
