'use client';

import { MarkupDevSupporterHelpButton } from '@/app/(ja)/(full-screen)/tools/markup-dev-supporter/MarkupDevSupporterHelpButton';
import { Toast } from '@/components/Dialog';
import { Switch } from '@/components/Form';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { setSelectionRange } from '@/utils/set-selection-range';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const buttonStyles =
  'w-full block text-sm text-left text-white bg-[#666] relative py-2.5 px-3 border border-[#676767] rounded-md hover:bg-[#555] transition-[background-color]';
const dummyElement = 'document' in globalThis ? document.createElement('div') : null;

export const TableDevSupporterContent = () => {
  const [source, setSource] = useState('');
  const [isViewSrc, setIsViewSrc] = useState(false);
  const [isCopyMode, setIsCopyMode] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [toastMessage, setToastMessage] = useState('');

  const copy = useCallback((value: string, message: string = '') => {
    navigator.clipboard.writeText(value);
    setToastMessage(message || 'コピーしました');
  }, []);
  const editorClickHandler = useCallback(
    (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const value = e.target.textContent?.trim() ?? '';

        if (value === '') {
          return;
        }

        e.preventDefault();
        const message = (() => {
          if (value.length < 10) {
            return `「${value}」をコピーしました`;
          }

          return `「${value.slice(0, 10)}...」をコピーしました`;
        })();
        copy(value, message); // trimした値をコピー
        setSelectionRange(e.target);
      }
    },
    [copy],
  );

  useEffect(() => {
    const editorContainer = editorContainerRef.current;
    if (!editorContainer) {
      return;
    }
    const target = editorContainer?.shadowRoot?.querySelector('app-editor') ?? null;
    const appEditor = (() => {
      if (target === null) {
        const editor = document.createElement('app-editor');
        const style = document.createElement('style');
        const shadow = editorContainer.attachShadow({
          mode: 'open',
        });

        style.textContent = `
          app-editor {
            display: block;
            width: fit-content;
            min-width: 100%;
            height: fit-content;
            min-height: 100%;
            padding: 1rem;
            box-sizing: border-box;
            inset: 0;
            font-size: 1rem;
            color: #333;
            contain: paint;
            border-radius: 8px;
            caret-color: #000; /* for iOS */

            :focus {
              outline: none;
              box-shadow: 0 0 0 2px #4d85ff;
            }
          }

          app-editor:focus-visible {
            outline: 2px solid #999;
            outline-offset: -5px;
          }

          table {
            color: #333;
            background: #fff;
            max-width: 100%;
            border-collapse: collapse;
          }
          table td,
          table th {
            padding: 2px 8px;
            border: 1px solid #ccc;
          }
        `;

        editor.setAttribute('contenteditable', 'true');
        editor.setAttribute('aria-label', 'DOM');
        shadow.append(style);
        shadow.append(editor);
        editorRef.current = editor;

        return editor;
      }

      return target;
    })();

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          setSource(appEditor.innerHTML);
        }
      }
    });

    mutationObserver.observe(appEditor, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [copy]);

  const update = useCallback(
    (tasks: string | string[]) => {
      const editor = editorRef.current;
      if (!editor || !dummyElement) {
        return;
      }

      let textContent = source;
      const types = Array.isArray(tasks) ? tasks : [tasks];
      const edit = ({ value, type }: { value: string; type: string }) => {
        switch (type) {
          case 'removeIndent':
            // タブ文字・半角スペースのみサポート
            return value.replace(/^([ |\t]+?)([^\s])/gm, (_, __, p2) => p2);
          case 'removeBreak':
            return value.replace(/[\n|\r]/g, '');

          case 'adjustBreak':
            return value
              .replace(/><caption/g, '>\n<caption')
              .replace(/><col/g, '>\n<col')
              .replace(/><thead/g, '>\n<thead')
              .replace(/><tbody/g, '>\n<tbody')
              .replace(/><tfoot/g, '>\n<tfoot')
              .replace(/><tr/g, '>\n<tr')
              .replace(/><th/g, '>\n<th')
              .replace(/><td/g, '>\n<td')
              .replace(/><\/tr/g, '>\n</tr')
              .replace(/><\/col>/g, '>\n</col>')
              .replace(/><\/colgroup>/g, '>\n</colgroup>')
              .replace(/><\/thead>/g, '>\n</thead>')
              .replace(/><\/tbody>/g, '>\n</tbody>')
              .replace(/><\/tfoot>/g, '>\n</tfoot>')
              .replace(/><\/table>/g, '>\n</table>');

          case 'removeAttributes':
            for (const node of dummyElement.querySelectorAll('*')) {
              for (const { name } of [...node.attributes]) {
                if (name === 'rowspan' || name === 'colspan') {
                  continue;
                }

                node.removeAttribute(name);
              }
            }
            return dummyElement.innerHTML;
          case 'removeElementsFromTableCells':
            for (const node of dummyElement.querySelectorAll('td, th')) {
              node.innerHTML = (node.textContent ?? '').trim();
            }

            return dummyElement.innerHTML;
          case 'numberAdjust':
            return value
              .replace(/０/g, '0')
              .replace(/１/g, '1')
              .replace(/２/g, '2')
              .replace(/３/g, '3')
              .replace(/４/g, '4')
              .replace(/５/g, '5')
              .replace(/６/g, '6')
              .replace(/７/g, '7')
              .replace(/８/g, '8')
              .replace(/９/g, '9');
          case 'spaceAdjust':
            return value.replace(/　/g, ' ');
          case 'onlySemantics':
            while (dummyElement.querySelector('div, span')) {
              for (const elm of dummyElement.querySelectorAll('div, span')) {
                const f = document.createDocumentFragment();

                for (const node of [...elm.childNodes]) {
                  f.append(node);
                }

                elm.replaceWith(f);
              }
            }

            return dummyElement.innerHTML;
          case 'addBreakAllTags':
            return value.replace(/></g, '>\n<');

          case 'removeAllTags':
            // 開始タグがあれば実施する
            if (/<(?!\!)/.test(dummyElement.innerHTML)) {
              dummyElement.innerHTML = value.trim();
            }

            return dummyElement.innerText;
          case 'removeAdjacentBlankLine':
            return value.replace(/^\s+$/gm, '').replace(/([\n|\r])[\n|\r]{2}/g, (m, p1) => p1);

          case 'removeBlankLine':
            return value.replace(/^\s+$/gm, '').replace(/([\n|\r])[\n|\r]/g, (m, p1) => p1);
          case 'removeAllImageTags':
            dummyElement.querySelectorAll('img, svg').forEach((elm) => elm.remove());
            return dummyElement.innerHTML;

          case 'removeAll':
            return '';

          default:
          // console.log(0);
        }

        return value;
      };

      dummyElement.textContent = '';
      dummyElement.insertAdjacentHTML('beforeend', textContent);

      for (const type of types) {
        textContent = edit({ value: textContent, type });
        dummyElement.textContent = '';
        dummyElement.insertAdjacentHTML('beforeend', textContent);
      }

      setSource(textContent);
      editor.textContent = '';
      editor.insertAdjacentHTML('beforeend', dummyElement.innerHTML);
    },
    [source],
  );

  return (
    <>
      <div
        className={clsx([
          'after:w-[calc(6ic_+_1.25rem)]after:p-2.5 sm:after:py-7px absolute left-0 top-0 grid h-[30%] w-full after:absolute after:bottom-[calc(100%+1px)] after:right-0 after:w-[calc(8ic+1.25rem)] after:p-2.5 after:text-center after:text-[0.75rem] after:leading-3 after:text-white after:transition-colors after:duration-200 after:ease-out sm:relative sm:size-auto sm:h-auto',
          isCopyMode ? "after:bg-alert after:content-['読み取り専用']" : 'after:bg-black',
          isCopyMode === false && isViewSrc && "after:content-['HTMLを編集中']",
          isCopyMode === false && isViewSrc === false && "after:content-['DOMを編集中']",
        ])}
      >
        <div
          className={clsx(['absolute size-full overflow-auto bg-[#969696]', isViewSrc && 'hidden'])}
          ref={editorContainerRef}
        />
        <textarea
          ref={textareaRef}
          className={clsx([
            'shadow-none! outline-offset-[-5px]! focus-visible:[outline:2px_solid_#999]! absolute size-full resize-none overflow-auto whitespace-pre-wrap bg-[#272822] p-4 font-mono text-[#cfcfc2] caret-[#cfcfc2] sm:text-sm',
            isViewSrc ? 'block' : 'hidden',
          ])}
          aria-label="HTMLソース"
          value={source}
          readOnly={isCopyMode}
          onClick={
            isCopyMode
              ? (e) => {
                  e.preventDefault();
                  if (e.currentTarget.value.trim() === '') {
                    return;
                  }
                  copy(e.currentTarget.value ?? '', 'ソースをコピーしました');
                  setSelectionRange(e.currentTarget);
                }
              : undefined
          }
          onChange={(e) => {
            setSource(e.target.value);
          }}
        />
      </div>

      <nav className="sm:w-(--navigation-width) absolute bottom-0 left-0 z-10 h-[70%] w-full overflow-y-scroll border-y border-black bg-[#333] pb-2.5 text-[#eee] sm:fixed sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-screen sm:border-0 sm:border-l">
        <div className="sticky -top-px z-10 border-b border-black bg-[#333] px-2.5 text-xs">
          <p className="border-b border-dashed border-[#777]">
            <label className="flex items-center justify-between gap-2 py-3">
              <span>HTMLを表示する</span>
              <Switch
                checked={isViewSrc}
                onChange={() => {
                  const editor = editorRef.current;
                  const textarea = textareaRef.current;

                  if (!editor || !textarea) {
                    return;
                  }

                  if (isViewSrc) {
                    editor.textContent = '';
                    editor.insertAdjacentHTML(
                      'beforeend',
                      textarea.value.replace(/<\/script>/g, '</noscript>').replace(/<script(\s.*?)>/g, '<noscript$1>'),
                    );
                  } else {
                    setSource(editor.innerHTML);
                  }

                  setIsViewSrc(!isViewSrc);
                }}
              />
            </label>
          </p>
          <p>
            <label className="flex items-center justify-between gap-2 py-3">
              <span>クリックで値コピーを有効にする</span>
              <Switch
                checked={isCopyMode}
                onChange={() => {
                  const editor = editorRef.current;
                  if (!editor) {
                    return;
                  }

                  if (isCopyMode) {
                    editor.setAttribute('contentEditable', '');
                    editor.removeEventListener('click', editorClickHandler);
                  } else {
                    editor.removeAttribute('contentEditable');
                    editor.addEventListener('click', editorClickHandler);
                  }

                  setIsCopyMode(!isCopyMode);
                }}
              />
            </label>
          </p>
        </div>

        <div className="p-2.5">
          <button
            type="button"
            className="align-center relative my-2.5 block w-full rounded-md border border-[#05355c] bg-[#044f8d] px-3 py-2.5 text-sm font-bold text-white transition-[background-color] hover:bg-[#033c6e]"
            onClick={() => {
              update(['removeIndent', 'removeBreak', 'adjustBreak', 'removeAttributes']);
              setToastMessage('フォーマットしました');
            }}
          >
            <span className="grid grid-cols-[1rem_auto] items-center justify-center gap-1 pr-2">
              <Image
                src="/common/images/icons/write.svg"
                alt=""
                width={16}
                height={16}
                className="inline-block size-4"
              />
              フォーマットする
            </span>
          </button>

          <details className="group mb-6 mt-2.5 rounded-md border border-[#777] open:mb-2.5">
            <summary className="palt group-open:bg-transparent! rounded-md p-2.5 text-xs transition-[background-color] before:mr-2 before:inline-block before:size-0 before:border-x-[0.35rem] before:border-t-8 before:border-x-transparent before:border-t-white before:transition-transform after:hidden hover:bg-[#444] before:group-open:rotate-180 group-open:hover:before:-translate-y-0.5">
              「フォーマットする」の自動処理を手動で実行する
            </summary>
            <ol className="space-y-2.5 px-2.5 pb-2.5">
              {[
                ['removeIndent', 'インデントを削除'],
                ['removeBreak', '改行をすべて削除'],
                ['adjustBreak', 'テーブル系タグ同士に改行を挿入'],
                ['removeAttributes', '属性値を削除'],
              ].map(([task, label]) => {
                return (
                  <li key={task}>
                    <button
                      type="button"
                      className={buttonStyles}
                      onClick={() => {
                        update(task);
                        setToastMessage(`${label}しました`);
                      }}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </details>

          <div className="my-2.5 rounded-md border border-[#777] p-2.5">
            <fieldset>
              <legend className="mb-2.5 text-[0.75rem]">その他の文字列置換</legend>
              <ul className="space-y-2.5">
                {[
                  ['numberAdjust', 'すべての全角数字を半角に変換'],
                  ['spaceAdjust', 'すべての全角スペースを半角に変換'],
                  ['addBreakAllTags', 'すべてのタグ同士を改行'],
                  ['removeAdjacentBlankLine', '連続する空白行を削除'],
                  ['removeBlankLine', 'すべての空白行を削除'],
                ].map(([task, label]) => {
                  return (
                    <li key={task}>
                      <button
                        type="button"
                        className={buttonStyles}
                        onClick={() => {
                          update(task);
                          setToastMessage(`${label}しました`);
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>

          <div className="my-2.5 space-y-2.5 rounded-md border border-[#777] p-2.5">
            <fieldset>
              <legend className="mb-2.5 text-[0.75rem]">その他のDOM操作</legend>
              <ul className="space-y-2.5">
                {[
                  ['removeElementsFromTableCells', 'テーブルセルの中のテキストノード以外を削除'],
                  ['onlySemantics', 'すべてのdivタグ、spanタグを削除'],
                  ['removeAllImageTags', 'すべてのimgタグ、svg要素を削除'],
                  ['removeAllTags', 'すべてのタグを削除'],
                  ['removeAll', '値をクリア'],
                ].map(([task, label]) => {
                  return (
                    <li key={task}>
                      <button
                        type="button"
                        className={buttonStyles}
                        onClick={() => {
                          update(task);
                          setToastMessage(`${label}しました`);
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          </div>
        </div>

        <p className="shadow-sticky sticky bottom-0 mt-6 px-2.5">
          <MarkupDevSupporterHelpButton />
        </p>

        <div className="px-2.5 pb-2.5">
          <ul className="border- mt-10 space-y-2 border-t border-dashed border-[#9c9c9c] pb-5 pt-10 text-sm text-[#9c9c9c] sm:space-y-1 sm:text-xs">
            {FOOTER_LINK_LIST.map(({ href, title, target }) => {
              return (
                <li
                  key={href}
                  className="relative pl-2.5 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-[#9c9c9c]"
                >
                  <Link href={href} target={target} className="text-inherit">
                    {title}
                    {target === '_blank' && (
                      <svg
                        role="img"
                        aria-label="新しいタブで開く"
                        version="1.1"
                        id="_x32_"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 512 512"
                        className="mb-[0.2em] ml-[0.2em] inline-block size-[1em]"
                      >
                        <g>
                          <path
                            d="M96,0v416h416V0H96z M472,376H136V40h336V376z"
                            style={{ fill: 'rgb(156, 156, 156)' }}
                          ></path>
                          <polygon
                            points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"
                            style={{ fill: 'rgb(156, 156, 156)' }}
                          ></polygon>
                          <polygon
                            points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688
		237.594,166.688 322.39,166.688 204.531,284.547 	"
                            style={{ fill: 'rgb(156, 156, 156)' }}
                          ></polygon>
                        </g>
                      </svg>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <Toast message={toastMessage} setMessage={setToastMessage} />
    </>
  );
};
