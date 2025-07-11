'use client';

// FIXME:いつか移植元からのコードを整理する

import {
  GetUrlFromDomFilterType,
  formatTargetList,
} from '@/app/(ja)/(wide-content)/tools/get-url-from-dom/format-target-list';
import { Radio } from '@/components/Form';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from '@/app/(ja)/(wide-content)/tools/get-url-from-dom/Client.module.css';
import { ClearButton } from '@/components/Clickable';
import { SvgIcon } from '@/components/Icons';

type FilterType = GetUrlFromDomFilterType;
type SortType = 'none' | 'sort' | 'reverse';
type DuplicateType = 'ignore' | 'highlight' | 'diff' | 'diff-filter' | 'filter';
type FormatType = 'table' | 'md-list' | 'plain';

const HIGH_LIGHT = '___HIGHLIGHT___';

export const GetUrlFromDOMContent = () => {
  const editAreaContainerRef = useRef<HTMLDivElement>(null);
  const editAreaRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [isEdited, setIsEdited] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('none');
  const [duplicateType, setDuplicateType] = useState<DuplicateType>('ignore');
  const [formatType, setFormatType] = useState<FormatType>('table');

  const [targetLength, setTargetLength] = useState(0);

  const exportResult = useCallback(
    ({
      filterType = 'all',
      sortType = 'none',
      duplicateType = 'ignore',
      formatType = 'table',
    }: {
      filterType?: GetUrlFromDomFilterType;
      sortType?: SortType;
      duplicateType?: DuplicateType;
      formatType?: FormatType;
    }) => {
      const editArea = editAreaRef.current;

      if (typeof editArea === 'undefined' || editArea === null) {
        return;
      }

      const result = resultRef.current;
      const targetList = [
        ...editArea.querySelectorAll<HTMLElement>('[href]'),
        ...editArea.querySelectorAll<HTMLElement>('[src]'),
        ...editArea.querySelectorAll<HTMLElement>('[style*="url("]'),
      ];

      if (typeof result === 'undefined' || result === null) {
        return;
      }

      result.textContent = '';

      if (targetList.length === 0) {
        setTargetLength(0);
        return;
      } else {
        targetList.forEach((elm, index) => {
          const indexAttributeName = 'data-___GET-URL-FROM-DOM-INDEX___';
          elm.removeAttribute(indexAttributeName);
          elm.setAttribute(indexAttributeName, String(index));
        });
      }

      const fragment = document.createDocumentFragment();
      let targets = formatTargetList({ targetList, filterType });
      const make = (callback: (_: { url: string; index: number }) => void) => {
        for (const url of targets) {
          callback(url);
        }
      };

      if (sortType === 'sort' || sortType === 'reverse') {
        targets.sort((a, b) => a.url.localeCompare(b.url));

        if (sortType === 'reverse') {
          targets = targets.reverse();
        }
      }

      switch (duplicateType) {
        case 'highlight':
          targets = targets.map(({ url, index }, _, self) => {
            if (self.findIndex((item) => item.url === url) !== self.findLastIndex((item) => item.url === url)) {
              url = `${HIGH_LIGHT}${url}`;
            }

            return { url, index };
          });

          break;

        case 'diff': // 重複のみ
          targets = targets.filter(
            ({ url }, _, self) =>
              self.findIndex((item) => item.url === url) !== self.findLastIndex((item) => item.url === url),
          );

          break;

        case 'diff-filter': {
          // 重複を重複なしで
          const entries = targets
            .filter(
              ({ url }, _, self) =>
                self.findIndex((item) => item.url === url) !== self.findLastIndex((item) => item.url === url),
            )
            .reverse()
            .map(({ url, index }) => {
              return [url, index];
            });
          const diffItems = Object.fromEntries(entries);

          targets = Object.entries(diffItems).map(([url, index]) => {
            return { url, index: Number(index) };
          });

          break;
        }

        case 'filter': {
          // 重複を削除する
          // 重複を重複なしで
          const diffItems: Record<string, number> = {};

          targets.forEach(({ url, index }) => {
            if (diffItems[url]) {
              return;
            }

            diffItems[url] = index;
          });

          targets = Object.entries(diffItems).map(([url, index]) => {
            return { url, index: Number(index) };
          });

          break;
        }

        default:
          break;
      }

      switch (formatType) {
        case 'md-list':
          make(({ url, index }) => {
            const span = document.createElement('span');
            const br = document.createElement('br');

            span.insertAdjacentHTML('afterbegin', `- <url-item data-index="${index}"><span>${url}</span></url-item>`);
            fragment.append(span);
            fragment.append(br);
          });

          break;

        case 'table':
          const table = document.createElement('table');

          make(({ url, index }) => {
            const tr = document.createElement('tr');

            tr.insertAdjacentHTML(
              'beforeend',
              `
          <tr>
            <td><url-item data-index="${index}"><span>${url}</span></url-item></td>
          </tr>
        `,
            );
            fragment.append(tr);
          });

          table.append(fragment);
          fragment.append(table);

          break;

        default:
          make(({ url, index }) => {
            const urlItem = document.createElement('url-item');
            const br = document.createElement('br');

            urlItem.setAttribute('data-index', String(index));
            urlItem.insertAdjacentHTML('afterbegin', `<span>${url}</span>`);
            fragment.append(urlItem);
            fragment.append(br);
          });

          break;
      }

      setTargetLength(fragment.querySelectorAll('url-item').length);

      // this.#highlightCheck(fragment);
      {
        for (const urlItem of fragment.querySelectorAll('url-item')) {
          const { textContent } = urlItem;

          if (textContent && textContent.startsWith(HIGH_LIGHT)) {
            const mark = document.createElement('mark');
            mark.textContent = textContent.replace(HIGH_LIGHT, '');
            urlItem.textContent = '';
            urlItem.append(mark);
          }
        }
      }

      {
        if (editAreaContainerRef.current && editAreaContainerRef.current.parentElement && editAreaRef.current) {
          const parentElement = editAreaContainerRef.current.parentElement;
          const edit = editAreaRef.current;

          const onPointerEnter = (e: Event) => {
            if (e.currentTarget instanceof HTMLElement === false) {
              return;
            }

            const target = edit.querySelector<HTMLElement>(
              `[data-___get-url-from-dom-index___="${e.currentTarget.dataset.index}"]`,
            );

            if (target === null) {
              return;
            }

            target.classList.add('___RELATED___NODE___');

            const rect = target.getBoundingClientRect();
            const parentRect = parentElement.getBoundingClientRect();
            const { scrollTop, scrollLeft } = parentElement;

            const left = rect.left - parentRect.left + scrollLeft - 30; // outline + 10
            const top = rect.top - parentRect.top + scrollTop - 60; // outline + 10 * 2(感覚値)

            parentElement.scroll(left, top);
          };
          const onPointerleave = () => {
            for (const elm of edit.querySelectorAll('.___RELATED___NODE___')) {
              elm.classList.remove('___RELATED___NODE___');
            }
          };
          for (const urlItem of fragment.querySelectorAll('url-item')) {
            urlItem.addEventListener('pointerenter', onPointerEnter);
            urlItem.addEventListener('pointerleave', onPointerleave);

            urlItem.addEventListener('contextmenu', (e) => e.preventDefault());
            urlItem.firstElementChild?.addEventListener('contextmenu', (e) => {
              e.stopPropagation();
            });
            urlItem.addEventListener('touchstart', (e) => e.preventDefault());
            urlItem.firstElementChild?.addEventListener('touchstart', (e) => {
              e.stopPropagation();
            });
          }
        }
      }
      result.append(fragment);
    },
    [],
  );

  useEffect(() => {
    const editAreaContainer = editAreaContainerRef.current;

    if (typeof editAreaContainer === 'undefined' || editAreaContainer === null) {
      return;
    }

    const shadowRoot =
      editAreaContainer.shadowRoot ??
      (() => {
        const _shadowRoot = editAreaContainer.attachShadow({ mode: 'open' });
        const style = new CSSStyleSheet();

        style.replaceSync(`
          :host {
            --editor-height: 30dvh;
          }

          :where(.___RELATED___NODE___) {
            outline-width: 10px!important;
            outline-style: solid!important;
            outline-color: #f00;
            outline-offset: 5px!important;
          }

          edit-area {
            display: block;
            position: relative;
            transform: translateZ(0.01px); /* position fixed 対策 */
            outline-color: #000;
          }

          @media (min-width: 768px) {
            :host {
              --editor-height: 80dvh;
            }
          }
        `);
        _shadowRoot.adoptedStyleSheets = [style];
        return _shadowRoot;
      })();
    const editArea =
      shadowRoot.querySelector<HTMLElement>('edit-area') ??
      (() => {
        const _editArea = document.createElement('edit-area');
        _editArea.contentEditable = 'true';
        _editArea.style.padding = '0.5rem';
        _editArea.style.width = 'max-content';
        _editArea.style.minWidth = 'calc(100% - 1rem)';
        _editArea.style.minHeight = 'calc(var(--editor-height) - 5.5rem)';
        _editArea.setAttribute('aria-label', 'ここに貼り付けてください');

        return _editArea;
      })();

    editAreaRef.current = editArea;
    shadowRoot.appendChild(editArea);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          if (editArea.textContent?.trim() || editArea.querySelector('img')) {
            setIsEdited(true);
          } else {
            setIsEdited(false);
          }

          exportResult({
            duplicateType,
            filterType,
            formatType,
            sortType,
          });
          break;
        }
      }
    });

    mutationObserver.observe(editArea, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [duplicateType, exportResult, filterType, formatType, sortType]);

  useEffect(() => {
    exportResult({
      duplicateType,
      filterType,
      formatType,
      sortType,
    });
  }, [duplicateType, exportResult, filterType, formatType, sortType]);

  return (
    <div className="border border-slate-400 sm:grid md:h-[80dvh] md:grid-cols-3">
      <div
        className={clsx([
          "scroll-hint-y relative h-[30dvh] overflow-auto bg-white p-2 pt-0 before:pointer-events-none before:absolute before:inset-0 before:top-5 before:m-auto before:size-full before:max-h-16 before:max-w-56 before:place-items-center before:rounded-md before:bg-[pink] before:text-sm before:content-['ここに貼り付けてください']",
          isEdited ? 'before:hidden' : 'before:grid',
          'md:h-auto',
        ])}
      >
        <div className="sticky -left-2 top-0 z-10 -mx-2 mb-0.5 flex justify-between bg-white/90 p-4 text-sm font-bold">
          <p
            onClick={() => {
              editAreaRef.current?.focus();
            }}
          >
            入力エリア
          </p>
          <p className="shadow-sticky rounded-full">
            <ClearButton
              size="small"
              onClick={() => {
                if (editAreaRef.current) {
                  editAreaRef.current.textContent = '';
                }
              }}
            />
          </p>
        </div>
        <div ref={editAreaContainerRef}></div>
      </div>
      <div className="space-y-paragraph scroll-hint-y h-[30dvh] overflow-auto border-y border-slate-400 p-4 md:h-auto md:border-x md:border-y-0">
        <fieldset>
          <legend className="text-sm font-bold">フィルタ</legend>
          <ul className="space-y-2 p-2">
            {(
              [
                { value: 'all', label: 'すべて' },
                { value: 'img', label: 'HTMLImageElement のみ' },
                { value: 'a', label: 'HTMLAnchorElement のみ' },
                { value: 'href', label: 'href属性 のみ' },
                { value: 'src', label: 'src属性 のみ' },
                { value: 'style', label: 'background-image のみ' },
                { value: 'no-style', label: 'background-image 以外' },
              ] as const
            ).map(({ value, label }) => (
              <li key={value}>
                <Radio
                  label={label}
                  name="filterType"
                  checked={filterType === value}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setFilterType(value);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-bold">ソート</legend>
          <ul className="space-y-2 p-2">
            {(
              [
                { value: 'none', label: 'ソートしない' },
                { value: 'sort', label: 'ソートする' },
                { value: 'reverse', label: '逆ソートする' },
              ] as const
            ).map(({ value, label }) => (
              <li key={value}>
                <Radio
                  label={label}
                  name="sortType"
                  checked={sortType === value}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setSortType(value);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-bold">重複</legend>
          <ul className="space-y-2 p-2">
            {(
              [
                { value: 'ignore', label: '無視' },
                { value: 'highlight', label: '重複をハイライトする' },
                { value: 'diff', label: '重複のみ' },
                { value: 'diff-filter', label: '重複を重複なしで' },
                { value: 'filter', label: '重複を削除する' },
              ] as const
            ).map(({ value, label }) => (
              <li key={value}>
                <Radio
                  label={label}
                  name="duplicateType"
                  checked={duplicateType === value}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setDuplicateType(value);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-bold">形式</legend>
          <ul className="space-y-2 p-2">
            {(
              [
                { value: 'table', label: 'テーブル' },
                { value: 'md-list', label: 'リスト（Markdown）' },
                { value: 'plain', label: 'プレーン' },
              ] as const
            ).map(({ value, label }) => (
              <li key={value}>
                <Radio
                  label={label}
                  name="formatType"
                  checked={formatType === value}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setFormatType(value);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
      <div className="scroll-hint-y min-h-[30dvh] overflow-auto">
        <h2 className="sticky left-0 top-0 border-b border-slate-300 bg-slate-200 px-4 py-2">
          Result:<span aria-live="polite">{isEdited && ` ${targetLength}件のURL`}</span>
        </h2>
        <div
          className="mb-paragraph text-nowrap p-4 pb-0 leading-normal"
          onClick={(e) => {
            if (window.getSelection && document.createRange && e.currentTarget.firstElementChild) {
              const range = document.createRange();
              range.selectNodeContents(e.currentTarget.firstElementChild);
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }}
        >
          <div className={clsx([styles.result, 'text-sm'])} ref={resultRef}></div>
          <p aria-live="polite">{isEdited && targetLength === 0 && '対象がありませんでした。'}</p>
        </div>
        {targetLength !== 0 && (
          <p className="pointer-events-none sticky bottom-4 left-0 grid place-items-center rounded-full px-4">
            <button
              type="button"
              className="shadow-sticky pointer-events-auto w-full max-w-80 rounded-full border border-black bg-white px-4 py-2 text-sm"
              onClick={() => {
                const targets = resultRef.current?.querySelectorAll('url-item') ?? [];

                if (
                  5 < targets.length &&
                  !confirm(`${targets.length}枚も同時に開こうとしています。本当に開きますか？`)
                ) {
                  return;
                }

                for (const { textContent } of targets) {
                  const url = textContent?.trim() ?? '';
                  try {
                    new URL(url);
                  } catch {
                    console.error('開けませんでした：' + url);
                  }

                  if (!window.open(url)) {
                    window.alert('ポップアップブロックが作動しているようです');
                    throw new Error('ポップアップブロックが作動しているようです');
                  }
                }
              }}
            >
              <span className="mx-auto grid w-fit grid-cols-[auto_1rem] place-items-center gap-1">
                <span>{`${targetLength}個のURLをすべて開く`}</span>
                <span className="relative block size-4">
                  <SvgIcon name="new-tab" alt="" />
                </span>
              </span>
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
