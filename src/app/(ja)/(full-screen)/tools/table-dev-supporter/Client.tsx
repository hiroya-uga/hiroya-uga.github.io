'use client';

import { TableDevSupporterHelp } from '@/app/(ja)/(full-screen)/tools/table-dev-supporter/TableDevSupporterHelp';
import { Switch } from '@/components/Form';
import { FOOTER_LINK_LIST } from '@/constants/link-list';
import { setSelectionRange } from '@/utils/set-selection-range';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const buttonStyles =
  'w-full block text-sm text-left text-white bg-[#666] relative py-2.5 px-3 border border-[#676767] rounded-md hover:bg-[#555] transition-[background-color]';

export const TableDevSupporterContent = () => {
  const [source, setSource] = useState('');
  const [isViewSrc, setIsViewSrc] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLElement | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const setTimeoutId = useRef(-1);
  const copy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    const dialog = dialogRef.current;

    if (dialog === null) {
      return;
    }

    dialog.textContent = 'コピーしました';
    dialog.open = true;

    clearTimeout(setTimeoutId.current);
    setTimeoutId.current = window.setTimeout(() => {
      dialog.textContent = '';
      dialog.open = false;
    }, 1000);
  }, []);

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
            width: 100%;
            height: 100%;
            overflow: auto;
            padding: 1rem;
            box-sizing: border-box;
            font-size: 1rem;
            color: #fff;
            position: absolute;
            inset: 0;
            font-size: 1rem;
            contain: paint;
            border-radius: 8px;

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

          @media screen and (min-width: 640px) {
            app-editor {
              font-size: 0.875rem;
            }
          }
        `;

        editor.setAttribute('contenteditable', 'true');
        editor.setAttribute('aria-label', 'DOM');
        shadow.append(style);
        shadow.append(editor);
        editor.addEventListener('click', (e) => {
          if (e.target instanceof HTMLTableCellElement) {
            copy(e.target.innerText.trim()); // trimした値をコピー
            setSelectionRange(e.target);
          }
        });
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
    ({ type }: { type: string }) => {
      const editor = editorRef.current;
      if (!editor) {
        return;
      }

      const edit = ({ value, type }: { value: string; type: string }) => {
        switch (type) {
          case 'removeIndent':
            // タブ文字・半角スペースのみサポート
            return value.replace(/^([ |\t]+?)([^\s])/gm, (_, __, p2) => p2);
          case 'removeBreak':
            return value.replace(/[\n|\r]/g, '');

          case 'adjustBreak':
            return value
              .replace(/><col/g, '>\n<col')
              .replace(/><thead/g, '>\n<thead')
              .replace(/><tbody/g, '>\n<tbody')
              .replace(/><tfoot/g, '>\n<tfoot')
              .replace(/><tr/g, '>\n<tr')
              .replace(/><th/g, '>\n<th')
              .replace(/><td/g, '>\n<td')
              .replace(/<\/td><\/tr>/g, '</td>\n</tr>')
              .replace(/><\/col>/g, '>\n</col>')
              .replace(/><\/colgroup>/g, '>\n</colgroup>')
              .replace(/><\/thead>/g, '>\n</thead>')
              .replace(/><\/tbody>/g, '>\n</tbody>')
              .replace(/><\/tfoot>/g, '>\n</tfoot>')
              .replace(/><\/table>/g, '>\n</table>');

          case 'removeElementsFromTableCells':
            for (const node of editor.querySelectorAll('td, th')) {
              node.innerHTML = (node.textContent ?? '').trim();
            }

            return editor.innerHTML;
          case 'removeAttributes':
            for (const node of editor.querySelectorAll('*')) {
              for (const { name } of [...node.attributes]) {
                if (name === 'rowspan' || name === 'colspan') {
                  continue;
                }

                node.removeAttribute(name);
              }
            }
            return editor.innerHTML;
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
            while (editor.querySelector('div, span')) {
              for (const elm of editor.querySelectorAll('div, span')) {
                const f = document.createDocumentFragment();

                for (const node of [...elm.childNodes]) {
                  f.append(node);
                }

                elm.replaceWith(f);
              }
            }

            return editor.innerHTML;
          case 'addBreakAllTags':
            return value.replace(/></g, '>\n<');

          case 'removeAllTags':
            // 開始タグがあれば実施する
            if (/<(?!\!)/.test(editor.innerHTML)) {
              editor.innerHTML = value.trim();
            }

            return editor.innerText;
          case 'removeAdjacentBlankLine':
            return value.replace(/^\s+$/gm, '').replace(/([\n|\r])[\n|\r]{2}/g, (m, p1) => p1);

          case 'removeBlankLine':
            return value.replace(/^\s+$/gm, '').replace(/([\n|\r])[\n|\r]/g, (m, p1) => p1);

          default:
          // console.log(0);
        }

        return value;
      };

      let textContent = source;
      textContent = edit({ value: source, type });

      setSource(textContent);
      editor.innerHTML = textContent;
    },
    [source],
  );

  return (
    <>
      <div
        className={clsx([
          "absolute left-0 top-0 h-2/5 w-full after:absolute after:bottom-[calc(100%_+_1px)] after:right-0 after:w-[calc(6ic_+_1.25rem)] after:bg-alert after:p-2.5 after:text-center after:text-[0.75rem] after:leading-[0.75rem] after:text-white after:transition-colors after:duration-200 after:ease-out after:content-['読み取り専用'] sm:relative sm:size-auto sm:h-auto sm:after:py-[0.4375rem]",
          ,
          isViewSrc ? 'block' : 'hidden',
        ])}
      >
        <div
          className="absolute size-full overflow-auto whitespace-pre-wrap p-4 font-mono text-sm !shadow-none !outline-offset-[-5px] focus-visible:![outline:2px_solid_#999]"
          role="textbox"
          aria-label="HTMLソース"
          aria-readonly="true"
          tabIndex={0}
          onClick={(e) => void setSelectionRange(e.currentTarget)}
        >
          {source}
        </div>
      </div>
      <div
        className={clsx([
          "absolute left-0 top-0 h-2/5 w-full after:absolute after:bottom-[calc(100%_+_1px)] after:right-0 after:w-[calc(6ic_+_1.25rem)] after:bg-[#ccc] after:p-2.5 after:text-center after:text-[0.75rem] after:leading-[0.75rem] after:text-[#333] after:transition-colors  after:duration-200 after:ease-out after:content-['編集中'] sm:relative sm:size-auto sm:h-auto sm:after:py-[0.4375rem]",
          isViewSrc && 'hidden',
        ])}
        ref={editorContainerRef}
      ></div>

      <nav className="absolute bottom-0 left-0 h-3/5 w-full overflow-auto border-y border-black bg-[#333] pb-2.5 text-[#eee] sm:fixed sm:left-auto sm:right-0 sm:top-0 sm:z-[1] sm:h-full sm:max-h-screen sm:w-[var(--navigation-width)] sm:border-0 sm:border-l">
        <p className="sticky top-0 z-10 border-b border-black bg-[#333]">
          <label className="flex items-center justify-between gap-2 px-2.5 py-3 text-sm">
            ソースを確認する
            <Switch checked={isViewSrc} onChange={() => setIsViewSrc(!isViewSrc)} />
          </label>
        </p>

        <div className="p-2.5">
          <button
            type="button"
            className="  align-center  relative  my-2.5  block w-full rounded-md border border-[#05355c]  bg-[#044f8d]  px-3 py-2.5 text-sm font-bold text-white transition-[background-color] hover:bg-[#033c6e]"
            onClick={() => {
              update({ type: 'removeIndent' });
              update({ type: 'removeBreak' });
              update({ type: 'adjustBreak' });
              update({ type: 'removeAttributes' });
              update({ type: 'removeElementsFromTableCells' });
            }}
          >
            テーブルを整形
          </button>

          <details className="group mb-6 open:mb-10">
            <summary className="palt  rounded-md px-1 py-2.5 text-xs before:mr-2 before:inline-block before:size-0 before:border-x-[0.35rem] before:border-t-8 before:border-x-transparent before:border-t-white before:transition-transform after:hidden hover:before:translate-y-0.5 before:group-open:rotate-180 group-open:hover:before:translate-y-0">
              「テーブルを整形」で行われる処理を手動で実行する
            </summary>
            <ol className="space-y-2.5 pl-4 pt-2.5">
              <li>
                <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeIndent' })}>
                  インデント削除
                </button>
              </li>
              <li>
                <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeBreak' })}>
                  改行全削除
                </button>
              </li>
              <li>
                <button type="button" className={buttonStyles} onClick={() => update({ type: 'adjustBreak' })}>
                  テーブル系タグ同士の改行挿入
                </button>
              </li>
              <li>
                <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeAttributes' })}>
                  属性値を削除する
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={buttonStyles}
                  onClick={() => update({ type: 'removeElementsFromTableCells' })}
                >
                  テーブルセルの中をテキストノードだけにする
                </button>
              </li>
            </ol>
          </details>

          <section className="my-2.5 space-y-2.5 rounded-md border border-[#777] p-2.5">
            <h2 className="text-[0.75rem]">その他の文字列置換</h2>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'numberAdjust' })}>
              全角数字をすべて半角に変換
            </button>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'spaceAdjust' })}>
              全角スペースをすべて半角に変換
            </button>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'addBreakAllTags' })}>
              タグ同士の全改行
            </button>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeAdjacentBlankLine' })}>
              連続する空白行の削除
            </button>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeBlankLine' })}>
              空白行の全削除
            </button>
          </section>

          <section className="my-2.5 space-y-2.5 rounded-md border border-[#777] p-2.5">
            <h2 className="text-[0.75rem]">その他のDOM操作</h2>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'onlySemantics' })}>
              divタグ、spanタグの全削除
            </button>
            <button type="button" className={buttonStyles} onClick={() => update({ type: 'removeAllTags' })}>
              タグの全削除
            </button>
          </section>
        </div>

        <div className="p-2.5">
          <TableDevSupporterHelp />

          <ul className="border- mt-10 space-y-2 border-t border-[#9c9c9c] border-dashed pb-5 pt-10 text-sm text-[#9c9c9c] sm:space-y-1 sm:text-xs">
            {FOOTER_LINK_LIST.map(({ href, title, target }) => {
              return (
                <li
                  key={href}
                  className="relative pl-2.5 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-[#9c9c9c]"
                >
                  <Link href={href} target={target} className="text-inherit">
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <dialog
        ref={dialogRef}
        aria-live="assertive"
        className="invisible rounded-md px-4 py-2 opacity-0 shadow-sticky transition-fade open:visible open:opacity-100"
      />
    </>
  );
};
