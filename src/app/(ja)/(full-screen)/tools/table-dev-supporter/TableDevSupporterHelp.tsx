'use client';
import { DiscList } from '@/components/List';
import { getMetadata } from '@/utils/seo';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import styles from '@/app/(ja)/(full-screen)/tools/table-dev-supporter/TableDevSupporterHelp.module.css';
import { setSelectionRange } from '@/utils/set-selection-range';

export const TableDevSupporterHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const dialog = ref.current;
        if (dialog && dialog.open) {
          e.preventDefault;
          dialog.close();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', onkeydown);
    return () => {
      window.removeEventListener('keydown', onkeydown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="w-full rounded-lg border border-[#9c9c9c] bg-[#333] py-3.5 pr-2 text-center text-[0.875rem] leading-none text-[#b2b2b2] transition-[background-color] hover:bg-[#444]"
        onClick={() => {
          const dialog = ref.current;

          if (!dialog) {
            return;
          }

          if (isOpen) {
            dialog.close();
          } else {
            dialog.showModal();
          }

          setIsOpen(!isOpen);
        }}
      >
        <span className="mx-auto grid w-fit grid-cols-[auto,1fr] place-items-center gap-1">
          <svg
            version="1.1"
            id="_x32_"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            className="size-4"
          >
            <g>
              <path
                d="M437.015,74.978C390.77,28.696,326.608-0.014,256,0C185.393-0.014,121.223,28.696,74.982,74.978
		C28.696,121.223-0.014,185.393,0,256c-0.014,70.608,28.696,134.778,74.982,181.023C121.226,483.304,185.393,512.015,256,512
		c70.608,0.015,134.77-28.696,181.015-74.977c46.288-46.245,75-110.415,74.985-181.023
		C512.015,185.393,483.304,121.223,437.015,74.978z M399.474,112.526c36.756,36.8,59.415,87.356,59.429,143.474
		c-0.014,56.119-22.674,106.674-59.429,143.474c-36.8,36.762-87.363,59.415-143.474,59.429
		c-56.114-0.014-106.674-22.667-143.474-59.429c-36.76-36.8-59.415-87.355-59.43-143.474c0.015-56.118,22.67-106.674,59.43-143.474
		c36.8-36.763,87.359-59.415,143.474-59.43C312.112,53.112,362.674,75.763,399.474,112.526z"
                style={{ fill: 'rgb(178, 178, 178)' }}
              ></path>
              <path
                d="M242.749,329.326c-14.208,0-25.73,11.519-25.73,25.726c0,14.192,11.522,25.718,25.73,25.718
		c14.196,0,25.714-11.526,25.714-25.718C268.463,340.845,256.945,329.326,242.749,329.326z"
                style={{ fill: 'rgb(178, 178, 178)' }}
              ></path>
              <path
                d="M184.363,173.852l17.515,14.037c3.566,2.852,8.674,2.748,12.118-0.252c0,0,2.152-3.889,8.896-7.741
		c6.778-3.83,15.57-6.911,28.708-6.956c11.462-0.022,21.459,4.252,28.278,10.097c3.385,2.904,5.918,6.133,7.47,9.11
		c1.563,2.986,2.133,5.6,2.126,7.585c-0.03,6.711-1.337,11.104-3.222,14.837c-1.433,2.8-3.303,5.274-5.715,7.674
		c-3.596,3.6-8.482,6.926-13.955,9.985c-5.482,3.082-11.389,5.808-17.359,9.096c-6.808,3.778-14.022,9.194-19.345,17.326
		c-2.659,4.015-4.737,8.622-6.059,13.466c-1.334,4.867-1.937,9.956-1.937,15.148c0,5.541,0,10.096,0,10.096
		c0,5.215,4.237,9.46,9.463,9.46h22.788c5.222,0,9.456-4.245,9.456-9.46c0,0,0-4.555,0-10.096c0-2,0.23-3.296,0.452-4.104
		c0.374-1.229,0.585-1.534,1.208-2.282c0.626-0.711,1.896-1.792,4.237-3.088c3.419-1.919,8.915-4.512,15.141-7.882
		c9.322-5.096,20.648-12.007,30.204-23.422c4.748-5.703,8.948-12.556,11.86-20.452c2.918-7.904,4.503-16.792,4.489-26.304
		c-0.008-9.637-2.622-18.8-6.882-26.926c-6.415-12.207-16.467-22.37-28.919-29.748c-12.448-7.341-27.47-11.822-43.777-11.822
		c-20.097-0.052-36.797,5.192-49.396,12.444c-12.656,7.222-18.111,15.629-18.111,15.629c-2.126,1.852-3.326,4.534-3.278,7.341
		C180.878,169.467,182.17,172.104,184.363,173.852z"
                style={{ fill: 'rgb(178, 178, 178)' }}
              ></path>
            </g>
          </svg>
          <span>Help</span>
        </span>
      </button>

      <dialog
        ref={ref}
        className="invisible fixed inset-0 z-[2] m-auto block max-h-[80vh] min-h-80 w-dialog max-w-[80vw] items-center justify-center rounded-lg bg-[#ddd] text-[#333] opacity-0 shadow-lg transition-[opacity,visibility] ease-out backdrop:bg-[#00000077] open:visible open:opacity-100"
        onClick={() => {
          const dialog = ref.current;
          if (!dialog) {
            return;
          }

          dialog.close();
          setIsOpen(false);
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 flex flex-wrap items-center justify-between gap-1 border-b border-[#999] bg-[#ddd] px-4 py-2">
            <h2>How to Use</h2>
            <p>
              <button
                type="button"
                className="rounded-full p-2.5"
                onClick={() => {
                  const dialog = ref.current;
                  if (!dialog) {
                    return;
                  }

                  dialog.close();
                  setIsOpen(false);
                }}
              >
                <Image src="/common/images/icons/cross.svg" alt="閉じる" width={12} height={12} />
              </button>
            </p>
          </div>

          <div className="overflow-auto p-4 pb-8 sm:p-8">
            <div className="mb-paragraph">
              {getMetadata('/tools/table-dev-supporter')
                .description?.split('\n')
                .map((description) => {
                  return <p key={description}>{description}</p>;
                })}
            </div>

            <DiscList
              list={[
                '貼り付けた表のセルをクリックすると、そのセルの中身のテキストがクリップボードにコピーされます。',
                '「テーブルを成型」ボタンを押すと、貼り付けた表のHTMLが成形されます。',
                '「ソースを確認する」スイッチをオンにすると、成形済みのHTMLソースが表示されます。',
              ]}
            />

            <p className="mt-paragraph">以下のサンプルの表でお試しいただけます。</p>
            <p className="mb-paragraph">
              実際には指示書・原稿などから表をコピーして、本ツールに貼り付けてみてください。
            </p>

            <table
              className={styles.sampleTable}
              onClick={(e) => {
                if (e.currentTarget instanceof HTMLTableElement) {
                  setSelectionRange(e.currentTarget);
                }
              }}
            >
              <caption className="bg-white/80 mb-2">サンプルの表</caption>
              <thead>
                <tr>
                  <th scope="column">ID</th>
                  <th scope="column">氏名</th>
                  <th scope="column">好きな寿司ネタ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">１</th>
                  <td>山田　太郎</td>
                  <td data-dummy="value">
                    <div>かんぱち</div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">２</th>
                  <td>佐藤　花子</td>
                  <td>うに</td>
                </tr>
                <tr>
                  <th scope="row">３</th>
                  <td>鈴木　次郎</td>
                  <td>いくら</td>
                </tr>
                <tr>
                  <th scope="row">４</th>
                  <td>田中　美咲</td>
                  <td>まぐろ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </>
  );
};
