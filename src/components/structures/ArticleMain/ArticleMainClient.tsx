'use client';

import hljs from 'highlight.js/lib/core';

import { SvgIcon } from '@/components/Icons';
import { ARTICLE_MAIN_ID } from '@/constants/id';
import { formattedDateString } from '@/utils/formatter';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { useCallback, useEffect, useRef, useState } from 'react';

const getReadingTime = (length: number) => {
  const charsPerMinute = 350; // 1分あたりの平均文字数
  return Math.ceil(length / charsPerMinute) || 1;
};

type ArticleInformationProps = {
  date?: string;
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
    const article = span?.closest('article')?.querySelector(`#${ARTICLE_MAIN_ID}`);
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
        '@w640:text-sm text-description @w640:mt-6 mt-3 text-xs transition-opacity delay-300 duration-700',
        status === 'loading' ? 'opacity-0' : '',
      ])}
    >
      <time dateTime={date}>{formattedDateString(date ? new Date(date) : new Date())}</time> -
      <span ref={ref} className="min-h-[1lh]" />
    </p>
  );
};

const NOTE_SELECTOR = 'a[href^="#note-"]';

export const ArticleFootNoteActivator = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState('');
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    document.querySelectorAll(NOTE_SELECTOR).forEach((node) => {
      node.setAttribute('aria-expanded', 'false');
    });

    const dialog = ref.current;

    if (dialog === null) {
      return;
    }
    dialog.close();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog === null) {
      return;
    }

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const id = target.getAttribute('href')?.replace('#note-', '');

      if (id === undefined) {
        return;
      }
      const note = document.getElementById(`note-${id}`);
      if (note === null) {
        return;
      }
      setIndex(id);
      setContent(note.innerHTML);
      document.querySelectorAll(NOTE_SELECTOR).forEach((node) => {
        node.setAttribute('aria-expanded', 'false');
      });
      target.setAttribute('aria-expanded', 'true');
      setIsOpen(true);

      setTimeout(() => {
        dialog.show();
      }, 10);
    };

    const onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialog.open) {
        close();
      }
    };
    window.addEventListener('keydown', onkeydown);
    document.querySelectorAll<HTMLAnchorElement>(NOTE_SELECTOR).forEach((node) => {
      node.setAttribute('role', 'button');
      node.setAttribute('aria-haspopup', 'dialog');
      node.setAttribute('aria-expanded', 'false');
      node.addEventListener('click', onClick);
    });

    return () => {
      window.removeEventListener('keydown', onkeydown);
      document.querySelectorAll<HTMLAnchorElement>(NOTE_SELECTOR).forEach((node) => {
        node.removeAttribute('role');
        node.removeAttribute('aria-haspopup');
        node.removeAttribute('aria-expanded');
        node.removeEventListener('click', onClick);
      });
    };
  }, [close]);

  return (
    <dialog
      ref={ref}
      className={clsx([
        'bg-(--background-color-banner)/80 fixed bottom-0 left-0 z-50 flex w-full flex-row-reverse p-4 transition-[translate,visibility]',
        isOpen ? 'translate-y-0' : 'translate-y-full',
      ])}
      inert={isOpen === false}
      aria-label={`脚注番号${index}`}
    >
      <div>
        <button
          onClick={() => void close()}
          className="hover:border-(--color-text) rounded-full border border-solid border-transparent p-3 transition-[border-color]"
        >
          <span className="relative block size-3">
            <SvgIcon name="cross" alt={`脚注番号${index}を閉じる`} />
          </span>
        </button>
      </div>
      <div className="grow content-center" dangerouslySetInnerHTML={{ __html: content }} />
    </dialog>
  );
};

export const ArticleCodeHighlightActivator = () => {
  useEffect(() => {
    const highlight = document.querySelectorAll('pre code[data-lang]');
    if (highlight.length === 0) {
      return;
    }

    hljs.registerLanguage('jsx', typescript);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', typescript);

    highlight.forEach((node) => {
      const code = node.textContent || '';
      const language = node.getAttribute('data-lang') || 'html';
      const __html = hljs.highlight(code, { language }).value;

      node.classList.add(`language-${language}`);
      node.innerHTML = __html;
    });
  }, []);

  return null;
};
