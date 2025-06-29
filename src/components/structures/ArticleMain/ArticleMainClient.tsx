'use client';

import { useEffect, useRef } from 'react';

const getReadingTime = (length: number) => {
  const charsPerMinute = 350; // 1分あたりの平均文字数
  return Math.ceil(length / charsPerMinute) || 1;
};

export const ArticleLength = () => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const span = ref.current;
    const article = span?.closest('article')?.lastElementChild;
    if (span === null || article instanceof HTMLElement === false) {
      return;
    }

    span.textContent = '';

    const length = article.textContent?.trim().length || 0;
    const textContent = `文字数：${length}文字／所要時間：${getReadingTime(length)}分`;
    const max = textContent.length;
    let i = 0;
    const setIntervalId = setInterval(() => {
      if (i >= max) {
        clearInterval(setIntervalId);
        return;
      }
      span.textContent = textContent.slice(0, i + 1);
      i++;
    }, 60);

    return () => {
      clearInterval(setIntervalId);
    };
  }, []);
  return <span ref={ref} className="min-h-[1lh]" />;
};
