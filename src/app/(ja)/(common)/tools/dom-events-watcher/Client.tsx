'use client';

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Details } from '@/components/ui/boxes/Details';
import { SvgIcon } from '@/components/ui/media/SvgIcon';
import { DOM_EVENTS_CONTAINER_ID } from '@/constants/id';

const getNow = () => {
  const date = new Date();

  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(
    2,
    '0',
  )}`;
};

// Object.keys は own プロパティしか返さず、継承元（Element など）の on* を取りこぼすため for...in でチェーンを辿る
const getHandlerEventNames = (prototype: object) => {
  const eventNames: string[] = [];

  for (const propName in prototype) {
    if (propName.startsWith('on')) {
      eventNames.push(propName.slice(2));
    }
  }

  return eventNames;
};

let key = -1;

const emptyEventNames: string[] = [];
let cachedEventNames: string[] | null = null;

const getEventNames = () => {
  if (!globalThis.window) {
    return emptyEventNames;
  }

  return (cachedEventNames ??= [
    ...new Set([
      // リスナーは要素に付けるため、Element / HTMLElement に on* が生えるイベントは下の抽出で拾える。ここには on* を持たないもの・生えないものだけを残す
      'afterscriptexecute', // Non-standard
      'beforescriptexecute', // Non-standard
      'compositionend',
      'compositionstart',
      'compositionupdate',
      'encrypted', // on* が無い
      'focusin',
      'focusout',
      'gesturechange', // Non-standard
      'gestureend', // Non-standard
      'gesturestart', // Non-standard
      'pointerlockchange',
      'pointerlockerror',
      // タッチ非対応の環境では on* が生えない
      'touchcancel',
      'touchend',
      'touchmove',
      'touchstart',
      'webkitmouseforcechanged', // Non-standard
      'webkitmouseforcedown', // Non-standard
      'webkitmouseforceup', // Non-standard
      'webkitmouseforcewillbegin', // Non-standard
      // input / video 固有の on*（enterpictureinpicture など）は HTMLElement からは辿れないため個別に集める
      ...getHandlerEventNames(HTMLElement.prototype),
      ...getHandlerEventNames(HTMLInputElement.prototype),
      ...getHandlerEventNames(HTMLVideoElement.prototype),
    ]),
  ]);
};

export const DOMEventWatcherContent = ({ id }: { id: string }) => {
  const ref = useRef<HTMLFormElement>(null);
  const timestampRef = useRef(getNow());
  const eventNames = useSyncExternalStore(
    () => () => {},
    getEventNames,
    () => emptyEventNames,
  );
  const logRef = useRef<[[string, string, string], ...([string, string] | string)[]]>([['', '', getNow()]]);
  const [log, setLog] = useState<typeof logRef.current>([['', '', getNow()]]);

  const handler = useCallback((e: Event) => {
    clearInterval(key);
    key = globalThis.window.setInterval(() => {
      timestampRef.current = getNow();
    }, 1000);

    if (!e.target) {
      return;
    }

    const isUsingPreventDefault = e.type === 'drop' || e.type === 'submit';
    const tagName = (() => {
      if (!(e.target instanceof HTMLElement)) {
        return String(Object.getPrototypeOf(e.target));
      }

      return e.target.tagName.toLocaleLowerCase();
    })();
    const eventName = (() => {
      const typeAttribute = 'type' in e.target ? e.target.type : null;
      const key = 'key' in e ? e.key : null;
      const data = 'data' in e ? e.data : null;
      const mediaProps =
        e.target instanceof HTMLMediaElement
          ? {
              // controls: e.target.controls,
              volume: `${Math.round(e.target.volume * 10000) / 100}%`,
              muted: e.target.muted,
              // paused: e.target.paused,
              currentTime: `${Math.round(e.target.currentTime * 100) / 100}s`,
              loop: e.target.loop,
              playbackRate: e.target.playbackRate,
            }
          : {};
      const commonOptions = {
        typeAttribute,
        key,
        data,
        ...mediaProps,
        'preventDefault()': isUsingPreventDefault ? 'called' : '',
      };
      const mergeOptions = (options: Record<string, unknown> = {}) => {
        const entries = Object.entries({
          ...commonOptions,
          ...options,
        }).filter(([_, state]) => {
          return state;
        });

        if (entries.length === 0) {
          return '';
        }

        const optionValues = Object.fromEntries(entries);

        return JSON.stringify(optionValues, null, '  ');
      };

      if (e instanceof KeyboardEvent) {
        const { altKey, ctrlKey, metaKey, shiftKey } = e;
        const options = mergeOptions({
          altKey,
          ctrlKey,
          metaKey,
          shiftKey,
        });

        return `${e.type}__options__(${options})`;
      }

      const options = mergeOptions();

      if (options) {
        return `${e.type}__options__(${options})`;
      }

      return e.type;
    })();

    if (isUsingPreventDefault) {
      e.preventDefault();
    }

    const maxIndex = (() => {
      let i = 0;

      for (let j = 0; j < logRef.current.length; j++) {
        if (typeof logRef.current[j] !== 'string') {
          i++;

          if (i === 300) {
            return j;
          }
        }
      }

      return -1;
    })();

    if (maxIndex >= 0) {
      logRef.current = logRef.current.slice(0, maxIndex) as typeof logRef.current;
    }

    const rest = logRef.current.slice(1).map((item) => {
      if (typeof item === 'string') {
        return item.replace('@@@', ' x ');
      }

      return [...item];
    }) as [string, string][];

    if (logRef.current[0][0] === tagName && logRef.current[0][1].startsWith(eventName)) {
      const [first] = logRef.current;
      const [_, countString] = first[1].split('@@@');
      const count = Number(countString);

      if (Number.isNaN(count)) {
        logRef.current = [[tagName, `${eventName}@@@2`, timestampRef.current], ...rest];

        return;
      }

      logRef.current = [[tagName, `${eventName}@@@${count + 1}`, timestampRef.current], ...rest];

      return;
    }

    const result = [[logRef.current[0][0], logRef.current[0][1]], ...rest] as ([string, string] | string)[];

    if (timestampRef.current === logRef.current[0][2]) {
      logRef.current = [[tagName, eventName, timestampRef.current], ...result];

      return;
    }

    logRef.current = [[tagName, eventName, timestampRef.current], timestampRef.current, ...result];
  }, []);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    // bubble しないイベント（invalid / play など）も子孫宛てなら capture フェーズで必ず通るため、form だけに登録する
    eventNames.forEach((eventName) => {
      target.addEventListener(eventName, handler, true);
    });

    return () => {
      eventNames.forEach((eventName) => {
        target.removeEventListener(eventName, handler, true);
      });
    };
  }, [eventNames, handler]);

  useEffect(() => {
    const update = () => {
      setLog(logRef.current);
      requestAnimationFrame(update);
    };

    update();
  }, []);

  return (
    <>
      <div className="mb-28">
        <Details summary="サポートしているイベントタイプ" id={`${id}-details`}>
          <div className="max-h-[70vh] overflow-y-scroll px-8 py-4">
            <p className="mb-2">このページで採用されているイベント一覧です。一部非標準、非推奨も含まれています。</p>
            <p className="mb-2">form要素には以下のイベントに関するハンドラをキャプチャフェーズで登録しています。</p>

            <ul className="pl-6">
              {eventNames
                .toSorted((a, b) => a.localeCompare(b))
                .map((eventName) => {
                  return (
                    <li className="mb-1 list-disc pl-1" key={eventName}>
                      {eventName}
                    </li>
                  );
                })}
            </ul>
          </div>
        </Details>
      </div>

      <div className="w1024:flex w1024:h-min gap-6">
        <div className="w1024:min-w-375px w1024:max-w-375px relative">
          <form
            ref={ref}
            className="border-secondary w1024:absolute w1024:left-0 w1024:top-0 w1024:h-full w1024:max-h-none max-h-[30vh] overflow-y-scroll overscroll-contain border border-solid p-4 pb-8"
            id={DOM_EVENTS_CONTAINER_ID}
            role="group"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-container-desc`}
          >
            <div className="min-h-[40vh]">
              <p id={`${id}-container-desc`} className="mb-8">
                <strong>ここに入力された値はどこにも送信されません。</strong>
              </p>

              <p className="border-secondary mb-8 touch-none border border-solid p-8 text-center">
                タッチイベントを無視するp要素
              </p>

              <p>
                <label htmlFor={id} className="mb-2 block w-fit font-bold">
                  テキストフィールド
                </label>
              </p>
              <p id={`${id}-description`} className="mb-2">
                ファイルのドラッグ＆ドロップも可能です。
              </p>
              <p className="mb-8">
                <input
                  id={id}
                  autoComplete="none"
                  aria-describedby={`${id}-description`}
                  placeholder="hogehoge"
                  className="w-full rounded border border-solid border-gray-500 p-4"
                />
              </p>

              <p>
                <label htmlFor={`${id}-required`} className="mb-2 block w-fit font-bold">
                  テキストフィールド（必須）
                </label>
              </p>

              <p className="mb-8">
                <input
                  id={`${id}-required`}
                  autoComplete="none"
                  placeholder="hogehoge"
                  required
                  className="w-full rounded border border-solid border-gray-500 p-4"
                />
              </p>

              <fieldset className="mb-8">
                <legend className="mb-2 block w-fit font-bold">ラジオボタン</legend>
                <ul>
                  <li>
                    <label>
                      <input type="radio" name="hoge" />
                      <span className="pl-2">項目1</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="hoge" />
                      <span className="pl-2">項目2</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="hoge" />
                      <span className="pl-2">項目3</span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset className="mb-8">
                <legend className="mb-2 block w-fit font-bold">チェックボタン</legend>
                <ul>
                  <li>
                    <label>
                      <input type="checkbox" name="hoge" />
                      <span className="pl-2">項目1</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="checkbox" name="hoge" />
                      <span className="pl-2">項目2</span>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="checkbox" name="hoge" />
                      <span className="pl-2">項目3</span>
                    </label>
                  </li>
                </ul>
              </fieldset>
            </div>

            <figure className="mb-8 text-center">
              <p className="mb-2">
                <video
                  src="/tools/dom-events-watcher/sample.mp4"
                  controls
                  muted
                  className="aspect-video h-auto w-96 max-w-full"
                ></video>
              </p>

              <figcaption>ミュートされた音声ありのサンプル動画（2.86秒）</figcaption>
            </figure>

            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-8 text-center">
              <p>
                <button type="button" className="min-w-64 rounded-lg bg-orange-300 px-4 py-2 text-black">
                  何も起こらないただのボタン
                </button>
              </p>

              <p>
                <button type="submit" className="min-w-64 rounded-lg bg-orange-300 px-4 py-2 text-black">
                  送信ボタン
                </button>
              </p>
            </div>
          </form>
        </div>

        <section>
          <h2 className="w1024:mt-0 mb-1.5 block w-fit font-bold">
            <strong id={`${id}-log-title`}>ログ</strong>（最大300行）
          </h2>

          <div className="mb-3 text-sm">
            <p>最後の作業から１秒経過すると、次の操作時にタイムスタンプの行が挿入されます。</p>
            <p>イベントを受け取った要素名、イベント名、一部補足情報が出力されます。</p>
          </div>
          <p className="border-secondary border border-b-0">
            <button
              type="button"
              className="ml-auto block rounded-lg p-2"
              onClick={() => {
                logRef.current = [['', '', getNow()]];
                setLog(logRef.current);
              }}
            >
              <span className="relative block size-4">
                <SvgIcon name="reload" alt="ログをクリア" />
              </span>
            </button>
          </p>

          <div
            className="scroll-hint-y w640:h-[50vh] border-secondary h-[30vh] overflow-y-scroll overscroll-contain border border-t-0 py-2"
            aria-labelledby={`${id}-log-title`}
          >
            <div
              className="w640:grid-cols-[auto_auto_auto_1fr] grid grid-cols-[auto_auto_1fr]"
              style={{
                counterReset: 'log',
              }}
            >
              {log.map((item, index) => {
                if (typeof item === 'string') {
                  return (
                    <p key={item} className="bg-secondary w640:col-[1/5] col-[1/4] my-1 grid px-2 text-right text-xs">
                      ↓ until {item}
                    </p>
                  );
                }

                const [tagName, eventNameValue] = item;

                if (!tagName) {
                  return <React.Fragment key={index} />;
                }

                const [eventName, times] = eventNameValue.split('@@@');
                const [name, options] = eventName.split('__options__');

                return (
                  <p
                    key={index}
                    className="keep-all w640:col-[1/5] w640:grid-cols-subgrid w640:before:text-right col-[1/4] my-1 grid grid-cols-subgrid grid-rows-[auto_auto] px-2 text-xs leading-tight before:col-[1/2] before:pr-3 before:font-mono before:content-[counter(log)]"
                    style={{
                      counterIncrement: 'log',
                    }}
                  >
                    <span className="leading-inherit w640:col-[2/3] w640:row-[1/2] col-[2/3] row-[1/2] pr-3 text-center">
                      <code className="w640:inline block text-nowrap">{tagName}</code>
                    </span>
                    <span className="w640:col-[3/4] w640:row-[1/2] col-[3/4] row-[1/2]">
                      {name}
                      {times && ` x ${times}`}
                    </span>
                    {options && (
                      <span className="text-alert leading-inherit w640:col-[4/5] w640:row-[1/2] w640:pl-4 col-[2/4] row-[2/3]">
                        {options}
                      </span>
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
