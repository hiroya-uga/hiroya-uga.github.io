'use client';

import { Toast } from '@/components/Dialog';
import { SvgIcon } from '@/components/Icons';
import { ARTICLE_MAIN_ID } from '@/constants/id';
import { copy } from '@/utils/copy';
import { formattedDateString, formattedTimeString } from '@/utils/formatter';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import styles from '@/components/structures/ArticleMain/ArticleMain.module.css';
import { getLocalStorage, setLocalStorage } from '@/utils/local-storage';
import { codeToHtml } from 'shiki';

const getLength = (article: HTMLElement) => {
  const temp = document.createElement('div');
  temp.innerHTML = article.innerHTML;
  temp.querySelectorAll('pre, code, .associate, [role="note"]').forEach((node) => {
    node.remove();
  });

  return temp.textContent?.replace(/\n/g, '').trim().length || 0;
};

const getReadingTime = (length: number) => {
  const charsPerMinute = 350; // 1分あたりの平均文字数
  return Math.ceil(length / charsPerMinute) || 1;
};

type ArticleInformationProps = {
  publishedAt?: string;
  updatedAt?: string;
};

export const ArticleInformation = ({ publishedAt, updatedAt }: ArticleInformationProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'already'>('loading');
  const isInitialized = useRef(false);

  const showInformation = useCallback((isAlready = false) => {
    const span = ref.current;
    const article = span?.closest('article')?.querySelector(`#${ARTICLE_MAIN_ID}`);
    if (span === null || article instanceof HTMLElement === false) {
      return;
    }

    span.textContent = '';

    const length = getLength(article);
    const fullText = `／ 文字数：約${length} ／ 所要時間：${getReadingTime(length)}分`;

    if (isAlready) {
      span.textContent = fullText;
      return;
    }

    const textContent = fullText;
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
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const isViewed = getSessionStorage('reading-message-viewed') === 'true';

    showInformation(isViewed);

    if (isViewed) {
      setStatus('already');
      return;
    }

    setStatus('ready');
    setSessionStorage('reading-message-viewed', 'true');
  }, [showInformation]);

  const updateDate =
    typeof updatedAt === 'string' && updatedAt !== ''
      ? ({
          shouldShowUpdate: true,
          date: new Date(updatedAt),
        } as const)
      : ({ shouldShowUpdate: false } as const);

  return (
    <p className="@w640:mt-4 @w640:text-sm text-secondary mt-3 text-xs">
      <span
        className={clsx([
          'noscript:hidden delay-300 duration-700',
          status === 'loading' ? 'opacity-0' : 'animate-fade-in',
        ])}
      >
        {updateDate.shouldShowUpdate && (
          <span className="block">
            最終更新日：
            <time dateTime={updatedAt} className="text-secondary mr-2">
              {formattedDateString(updateDate.date)} {formattedTimeString(updateDate.date)}
            </time>
          </span>
        )}
        {publishedAt && '公開日：'}
        <time dateTime={publishedAt} className="mr-2">
          {formattedDateString(publishedAt ? new Date(publishedAt) : new Date())}
        </time>
        <span ref={ref} className="min-h-lh" />
      </span>
      <noscript>
        <span className="animate-fade-in block opacity-0 [animation-delay:300ms]">
          {updatedAt && (
            <span className="block">
              最終更新日：
              <time dateTime={updatedAt} className="text-secondary mr-2">
                {formattedDateString(new Date(updatedAt))} {formattedTimeString(new Date(updatedAt))}
              </time>
            </span>
          )}
          {publishedAt && '公開日：'}
          <time dateTime={publishedAt}>{formattedDateString(publishedAt ? new Date(publishedAt) : new Date())}</time>
        </span>
      </noscript>
    </p>
  );
};

/**
 * Table of Contents highlight logic
 * Based on MDN/fred:
 * https://github.com/mdn/fred/blob/712e1619fff60510e1b73e1447fa512bd8af192d/hooks/toc-highlight.js
 */
const useTocHighlight = () => {
  const cleanupRef = useRef(() => {});
  const highlight = useCallback((container: HTMLDivElement | null) => {
    cleanupRef.current();

    const anchors = container?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    if (anchors === undefined || anchors.length === 0) {
      return;
    }

    const anchorsBySections = new Map<HTMLElement, HTMLAnchorElement>();

    for (const anchor of anchors) {
      const href = anchor.getAttribute('href');

      if (href === null) {
        continue;
      }

      const id = decodeURIComponent(href).slice(1);
      const heading = document.getElementById(id);
      const section = heading?.closest('section');

      if (section instanceof HTMLElement && section.tagName === 'SECTION') {
        anchorsBySections.set(section, anchor);
      }
    }

    const intersectTimesByAnchor = new WeakMap<HTMLAnchorElement, number>();
    const sections = [...anchorsBySections.keys()];
    const neverDisplayedSections = new Set<HTMLElement>(sections);
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (target instanceof HTMLElement === false || target.tagName !== 'SECTION') {
          continue;
        }

        if (neverDisplayedSections.has(target)) {
          if (isIntersecting === false) {
            // 実際に intersect するまでは intersectTimes を増減させない
            continue;
          }

          neverDisplayedSections.delete(target);
        }

        const anchor = anchorsBySections.get(target);

        if (anchor === undefined) {
          continue;
        }

        const prevIntersectTimes = intersectTimesByAnchor.get(anchor) ?? 0;
        const intersectTimes = isIntersecting ? prevIntersectTimes + 1 : prevIntersectTimes - 1;
        const isCurrent = 0 < intersectTimes;

        if (isCurrent) {
          anchor.ariaCurrent = 'location';
        } else {
          anchor.removeAttribute('aria-current');
        }

        intersectTimesByAnchor.set(anchor, intersectTimes);
      }
    });

    for (const section of anchorsBySections.keys()) {
      observer.observe(section);
    }

    cleanupRef.current = () => {
      observer.disconnect();
    };
  }, []);
  const cleanup = useCallback(() => cleanupRef.current(), []);

  return { highlight, cleanup };
};

export const ArticleTOC = ({ toc }: { toc: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { highlight, cleanup } = useTocHighlight();

  useEffect(() => {
    highlight(ref.current);

    return () => {
      cleanup();
    };
  }, [highlight, cleanup]);

  return (
    <div
      ref={ref}
      className={clsx([
        styles.toc,
        '@w1280:col-start-3 @w1280:row-start-1 @w1280:row-end-3 @w1280:pl-14 @w640:mb-14 mb-8 ml-auto',
      ])}
    >
      <nav
        className={clsx([
          'border-accent bg-secondary px-18PX pt-16PX rounded-r-md border-l-2 pb-6 text-sm',
          '@w1280:sticky @w1280:top-17 @w1280:w-fit @w1280:min-w-280px @w1280:max-w-360px @w1280:shadow-sticky @w1280:max-h-[calc(80vh-4.25rem)] @w1280:scroll-hint-y @w1280:overflow-y-auto',
        ])}
      >
        <h2 className="@w800:text-lg font-bold">目次</h2>
        <div className="@w1280:pl-0 pl-16PX mt-4" dangerouslySetInnerHTML={{ __html: toc }} />
      </nav>
    </div>
  );
};

const isSlider = (eventTarget: EventTarget | null): eventTarget is HTMLInputElement => {
  return eventTarget instanceof HTMLInputElement && eventTarget.classList.contains('image-diff-viewer__slider');
};

export const ArticleImageDiffViewerActivator = () => {
  useEffect(() => {
    const onInput = (e: Event) => {
      if (isSlider(e.target) === false) {
        return;
      }

      const input = e.target;
      const element = input.closest<HTMLElement>('.image-diff-viewer');

      if (element === null) {
        return;
      }

      const currentValue = parseInt(input.value, 10);
      element.style.setProperty('--v-value', `${100 - currentValue}%`);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (isSlider(e.target) === false) {
        return;
      }

      if (e.key === 'Shift') {
        e.target.step = '10';
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isSlider(e.target) === false) {
        return;
      }

      if (e.key === 'Shift') {
        e.target.step = '1';
      }
    };

    window.addEventListener('input', onInput);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('input', onInput);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return null;
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
        'bg-primary/90 border-t-primary fixed bottom-0 left-0 z-50 flex w-full flex-row-reverse border-t p-4 transition-[translate,visibility]',
        // 150%くらいにしないとTwitterのWebViewでチラ見えする。
        isOpen ? 'translate-y-0' : 'translate-y-[150%]',
      ])}
      inert={isOpen === false}
      aria-label={`脚注番号${index}`}
      closedby="none"
    >
      <div>
        <button
          onClick={() => close()}
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
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const highlight = document.querySelectorAll<HTMLElement>('pre code[data-language]');

    if (highlight.length === 0) {
      return;
    }

    highlight.forEach(async (node) => {
      // 既にハイライトされている場合はスキップ
      if (node.dataset.highlighted === 'true') {
        return;
      }

      const code = node.textContent || '';
      const lang = node.getAttribute('data-language') || 'html';

      if (
        [
          'jsx',
          'tsx',
          'html',
          'css',
          'js',
          'javascript',
          'ts',
          'typescript',
          'json',
          'sh',
          'powershell',
          'yml',
        ].includes(lang) === false
      ) {
        return;
      }

      const __html = await codeToHtml(code, {
        lang,
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
      });

      node.classList.add(`language-${lang}`);
      node.dataset.highlighted = 'true';
      node.parentElement?.insertAdjacentHTML('afterend', __html);
      node.parentElement?.remove();
    });
  }, []);

  const svgId = `copy-${useId().replace(/[^a-z0-9]/g, '-')}`;
  const [toastMessage, setToastMessage] = useState('');
  const copyCode = useCallback((button: HTMLButtonElement) => {
    const title = button.previousElementSibling?.textContent ?? '';
    const code = button.parentElement?.nextElementSibling?.textContent ?? '';

    if (code.trim() === '') {
      return;
    }

    copy(code);
    setToastMessage(`${title}をコピーしました。`);
  }, []);

  useEffect(() => {
    const codeBlockCaption = document.querySelectorAll('.codeblock__caption:not(:has(.codeblock__caption__copy))');

    codeBlockCaption.forEach((node) => {
      const title = node.textContent?.trim() || '';

      node.insertAdjacentHTML(
        'beforeend',
        `
        <button class="codeblock__caption__copy" title="${title}のコードをコピー">
          <svg role="presentation">
            <use href="#${svgId}" />
          </svg>
        </button>
      `,
      );
    });

    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element === false) {
        return;
      }

      const target = (() => {
        if (e.target instanceof HTMLButtonElement && e.target.classList.contains('codeblock__caption__copy')) {
          return e.target;
        }

        return e.target.closest<HTMLButtonElement>('.codeblock__caption__copy');
      })();

      if (target) {
        copyCode(target);
      }
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [copyCode, svgId]);

  return (
    <>
      <Toast message={toastMessage} setMessage={setToastMessage} />
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol id={svgId} viewBox="0 0 512 512">
          <style>{`.${svgId} {fill:var(--v-fill, var(--color-primary))}`}</style>
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

const resolveSwitchData = (nodeList: NodeListOf<HTMLElement>) => {
  const platforms = new Set<string>();
  const firstCodeBlocks = new Set<HTMLElement>();
  let index = 0;

  for (const node of nodeList) {
    const platform = node.dataset.platform;

    if (platform === undefined || platform === '') {
      return { error: new Error('Invalid element found') };
    }

    platforms.add(platform);

    if (index % 2 === 0) {
      firstCodeBlocks.add(node);
    }
    index++;
  }

  return { error: null, platforms, firstCodeBlocks };
};

export const ArticleCodeBlockSwitchActivator = () => {
  useEffect(() => {
    const switchData = resolveSwitchData(document.querySelectorAll<HTMLElement>('[data-platform].codeblock'));

    if (switchData.error) {
      throw new Error('Invalid Markdown');
    }

    const style = document.createElement('style');
    style.textContent = `
      [class~="codeblock"][data-platform] {
        display: none;
      }

      ${[...switchData.platforms]
        .map((platform) => {
          return `html[data-platform="${platform}"] [class~="codeblock"][data-platform="${platform}"]`;
        })
        .join(', ')} {
        display: block;
      }
    `;

    document.head.appendChild(style);

    [...switchData.firstCodeBlocks].forEach((node, index) => {
      const div = document.createElement('div');
      const name = `codeblock-switcher-${index}`;

      div.className = 'codeblock-switcher';
      div.setAttribute('role', 'radiogroup');
      div.setAttribute('aria-label', '言語切替');
      div.insertAdjacentHTML(
        'afterbegin',
        `
        <ul class="codeblock-switcher__list">
          ${[...switchData.platforms]
            .map(
              (platform) => `
                <li class="codeblock-switcher__item">
                  <label class="codeblock-switcher__label">
                    <input type="radio" name="${name}" class="codeblock-switcher__radio" data-platform="${platform}"/>
                      ${platform}
                  </label>
                </li>`,
            )
            .join('')}
          </ul>
      `,
      );

      node.before(div);
    });

    const platformFromStorage = getLocalStorage('platform');
    const defaultPlatform = switchData.platforms.has(platformFromStorage ?? '')
      ? platformFromStorage
      : switchData.platforms.values().next().value;

    if (defaultPlatform) {
      document.documentElement.dataset.platform = defaultPlatform;
      document.querySelectorAll<HTMLInputElement>('.codeblock-switcher__radio').forEach((node) => {
        node.checked = node.dataset.platform === defaultPlatform;
      });
    }

    const onChange = (e: Event) => {
      if (
        e.target instanceof HTMLInputElement === false ||
        e.target.classList.contains('codeblock-switcher__radio') === false
      ) {
        return;
      }

      const platform = e.target.dataset.platform ?? '';

      if (switchData.platforms.has(platform) === false) {
        return;
      }

      document.querySelectorAll<HTMLInputElement>('.codeblock-switcher__radio').forEach((node) => {
        node.checked = node.dataset.platform === platform;
      });

      document.documentElement.dataset.platform = platform;
      setLocalStorage('platform', platform);
    };

    window.addEventListener('change', onChange);

    return () => {
      document.querySelectorAll('.codeblock-switcher').forEach((node) => {
        node.remove();
      });
      window.removeEventListener('change', onChange);
      style.remove();
    };
  }, []);
  return null;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    twttr?: {
      widgets: {
        load: (_: Element) => void;
      };
    };
  }
}

export const ArticleYoutubeManager = () => {
  const instancesRef = useRef<YT.Player[]>([]);

  useEffect(() => {
    let setTimeoutId = -1;
    const instances = instancesRef.current;
    const init = () => {
      const players = document.querySelectorAll<HTMLIFrameElement>('.youtube iframe');

      for (const player of players) {
        // 既に初期化されている場合はスキップ
        if (player.dataset.jsApi === 'ready') {
          continue;
        }

        const instance = new window.YT.Player(player, {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                for (const instance of instances) {
                  if (event.target !== instance) {
                    instance.pauseVideo();
                  }
                }
              }
            },
          },
        });

        player.dataset.jsApi = 'ready';
        instancesRef.current.push(instance);
      }
    };

    if (window.YT) {
      // SPAレンダリング時、iframeが存在しない状態で描画されるケースがある（.youtubeは存在するが、その子のiframeが存在しない）
      setTimeoutId = window.setTimeout(init, 100);
    } else {
      if (document.querySelector('script[src*="youtube.com/iframe_api"]') === null) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }

      window.onYouTubeIframeAPIReady = init;
    }

    return () => {
      clearTimeout(setTimeoutId);
      instances.forEach((instance) => {
        instance.destroy();
      });
    };
  }, []);
  return null;
};

export const ArticleTwitterActivator = () => {
  const id = useId();

  useEffect(() => {
    if (document.getElementById(id) === null) {
      const script = document.createElement('script');
      script.id = id;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      document.querySelectorAll('.twitter-tweet').forEach((container) => {
        window.twttr?.widgets.load(container);
      });
    }
  }, [id]);

  return null;
};
