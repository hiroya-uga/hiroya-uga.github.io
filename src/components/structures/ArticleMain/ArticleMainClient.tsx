'use client';

import { formattedDateString } from '@/utils/formatter';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const getReadingTime = (length: number) => {
  const charsPerMinute = 350; // 1分あたりの平均文字数
  return Math.ceil(length / charsPerMinute) || 1;
};

type ArticleInformationProps = {
  date: string;
};

export const ArticleInformation = ({ date }: ArticleInformationProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [status, setIsFirstRender] = useState<'loading' | 'ready' | 'already'>('loading');

  useEffect(() => {
    const isViewed = getSessionStorage('reading-message-viewed') === 'true';

    if (isViewed) {
      setIsFirstRender('already');
    } else {
      setIsFirstRender('ready');
    }

    setSessionStorage('reading-message-viewed', 'true');
  }, []);

  useEffect(() => {
    const span = ref.current;
    const article = span?.closest('article')?.lastElementChild;
    if (status === 'loading' || span === null || article instanceof HTMLElement === false) {
      return;
    }

    span.textContent = '';
    const length = article.textContent?.trim().length || 0;

    if (status === 'already') {
      span.textContent = `文字数：${length}文字／所要時間：${getReadingTime(length)}分`;
      return;
    }

    const textContent = `文字数：${length}文字／所要時間：${getReadingTime(length)}分`;
    const max = textContent.length;
    let i = 0;
    let setIntervalId = -1;

    setTimeout(() => {
      setIntervalId = window.setInterval(() => {
        if (i >= max) {
          clearInterval(setIntervalId);
          return;
        }
        span.textContent = textContent.slice(0, i + 1);
        i++;
      }, 60);
    }, 300);

    return () => {
      clearInterval(setIntervalId);
    };
  }, [status]);
  return (
    <p
      className={clsx([
        '@w640:text-sm text-description text-xs transition-opacity',
        status === 'loading' ? 'opacity-0' : '',
      ])}
    >
      <time>{formattedDateString(new Date(date))}</time> -
      <span ref={ref} className="min-h-[1lh]" />
    </p>
  );
};
