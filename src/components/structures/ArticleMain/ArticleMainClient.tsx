'use client';

import hljs from 'highlight.js/lib/core';

import { Toast } from '@/components/Dialog';
import { SvgIcon } from '@/components/Icons';
import { ARTICLE_MAIN_ID } from '@/constants/id';
import { copy } from '@/utils/copy';
import { formattedDateString } from '@/utils/formatter';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

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
        '@w640:text-sm text-secondary @w640:mt-6 mt-3 text-xs transition-opacity delay-300 duration-700',
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
        'bg-(--background-color-primary)/80 fixed bottom-0 left-0 z-50 flex w-full flex-row-reverse p-4 transition-[translate,visibility]',
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
    const highlight = document.querySelectorAll('pre code[data-language]');
    if (highlight.length === 0) {
      return;
    }

    hljs.registerLanguage('jsx', typescript);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', typescript);

    highlight.forEach((node) => {
      const code = node.textContent || '';
      const language = node.getAttribute('data-language') || 'html';

      if (['jsx', 'html', 'css', 'javascript'].includes(language) === false) {
        return;
      }

      const __html = hljs.highlight(code, { language }).value;

      node.classList.add(`language-${language}`);
      node.innerHTML = __html;
    });
  }, []);

  const svgId = `copy-${useId().replace(/[^a-z0-9]/g, '-')}`;
  const [toastMessage, setToastMessage] = useState('');
  const copyCode = useCallback((e: MouseEvent) => {
    if (e.currentTarget instanceof HTMLButtonElement === false) {
      return;
    }

    const title = e.currentTarget.previousElementSibling?.textContent ?? '';
    const code = e.currentTarget.parentElement?.nextElementSibling?.textContent ?? '';

    if (code.trim() === '') {
      return;
    }

    copy(code);
    setToastMessage(`${title}をコピーしました。`);
  }, []);

  useEffect(() => {
    const codeBlockCaption = document.querySelectorAll('.codeblock__caption:not(:has(.codeblock__caption__copy))');
    if (codeBlockCaption.length === 0) {
      return;
    }

    codeBlockCaption.forEach((node) => {
      const title = node.textContent?.trim() || '';

      node.insertAdjacentHTML(
        'beforeend',
        `
        <button class="codeblock__caption__copy" title="${title}のコードをコピー">
          <svg role="img">
            <use href="#${svgId}" />
          </svg>
        </button>
      `,
      );

      if (node.lastElementChild instanceof HTMLButtonElement) {
        node.lastElementChild.addEventListener('click', copyCode);
      }
    });
  }, [copyCode, svgId]);

  return (
    <>
      <Toast message={toastMessage} setMessage={setToastMessage} />
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id={svgId} x="0px" y="0px" viewBox="0 0 512 512">
          <style type="text/css">{`.${svgId}{fill:var(--color-text);}`}</style>
          <g>
            <rect x="115.774" y="335.487" className={svgId} width="194.387" height="18.588"></rect>
            <rect x="115.774" y="260.208" className={svgId} width="194.387" height="18.527"></rect>
            <rect x="115.774" y="184.862" className={svgId} width="194.387" height="18.588"></rect>
            <rect x="218.582" y="109.576" className={svgId} width="91.58" height="18.588"></rect>
            <path
              className={svgId}
              d="M385.112,396.188V39.614c0-2.294-0.197-4.603-0.592-6.768C381.3,14.19,365.006,0,345.438,0H184.686
		c-11.561,0-22.598,4.603-30.741,12.747L53.637,112.986c-8.151,8.22-12.747,19.249-12.747,30.818v252.384
		c0,21.802,17.806,39.607,39.683,39.607h264.864C367.308,435.795,385.112,417.99,385.112,396.188z M170.634,27.529v89.074
		c0,9.662-3.745,13.399-13.339,13.399H68.222L170.634,27.529z M63.163,396.188V149.775h106.02c3.486,0,6.768-0.85,9.655-2.362
		c4.079-2.036,7.361-5.324,9.328-9.328c1.519-2.894,2.302-6.115,2.302-9.526V22.272h154.97c7.156,0,13.331,4.33,15.959,10.574
		c0.92,2.104,1.376,4.337,1.376,6.768v356.574c0,9.518-7.748,17.342-17.335,17.342H80.574
		C70.98,413.53,63.163,405.706,63.163,396.188z"
            ></path>
            <path
              className={svgId}
              d="M431.488,76.205h-26.732l1.375,22.272h25.356c9.594,0,17.349,7.748,17.349,17.342v356.573
		c0,9.519-7.755,17.342-17.349,17.342H166.562c-7.163,0-13.339-4.406-15.968-10.581c-0.85-2.097-1.374-4.33-1.374-6.761V456.89
		h-22.272v15.503c0,2.294,0.198,4.589,0.593,6.761c3.22,18.588,19.515,32.846,39.022,32.846h264.926
		c21.877,0,39.622-17.805,39.622-39.607V115.82C471.11,93.943,453.365,76.205,431.488,76.205z"
            ></path>
          </g>
        </symbol>
      </svg>
    </>
  );
};
