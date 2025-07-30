'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Details } from '@/components/Box';

const getNow = () => {
  const date = new Date();

  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(
    2,
    '0',
  )}`;
};

let key = -1;

const inputElementEvents = [
  'invalid',
  'search', //Non-standard
  'select',
  'selectionchange', // Experimental
];
const mediaElementEvents = [
  ...new Set([
    // video
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'encrypted',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
  ]),
];

export const DOMEventWatcherContent = ({ id }: { id: string }) => {
  const ref = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requiredInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<{ src?: string }>({});
  const timestampRef = useRef(getNow());
  const [eventNames, setEventNames] = useState<string[]>([]);
  const logRef = useRef<[[string, string, string], ...([string, string] | string)[]]>([['', '', timestampRef.current]]);
  const [log, setLog] = useState<typeof logRef.current>(logRef.current);

  const handler = useCallback((e: Event) => {
    clearInterval(key);
    key = window.setInterval(() => {
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
    const events = [
      ...new Set([
        'afterscriptexecute', // Non-standard
        'animationcancel',
        'animationend',
        'animationiteration',
        'animationstart',
        'auxclick',
        'beforematch', // Experimental
        'beforescriptexecute', // Non-standard
        'beforexrselect', // Experimental
        'blur',
        'click',
        'compositionend',
        'compositionstart',
        'compositionupdate',
        'contentvisibilityautostatechange', // Experimental
        'contextmenu',
        'copy',
        'cut',
        'dblclick',
        // "DOMActivate",// 非推奨
        // 'DOMMouseScroll', // Non-standard & 非推奨
        'focus',
        'focusin',
        'focusout',
        'fullscreenchange',
        'fullscreenerror',
        'gesturechange', // Non-standard
        'gestureend', // Non-standard
        'gesturestart', // Non-standard
        'gotpointercapture',
        'keydown',
        // "keypress",// 非推奨
        'keyup',
        'lostpointercapture',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        // 'mousewheel', // Non-standard & 非推奨
        // 'MozMousePixelScroll', // Non-standard & 非推奨
        'paste',
        'pointercancel',
        'pointerdown',
        'pointerenter',
        'pointerleave',
        'pointermove',
        'pointerout',
        'pointerover',
        'pointerrawupdate', // Experimental
        'pointerup',
        'scroll',
        'scrollend',
        'securitypolicyviolation',
        'touchcancel',
        'touchend',
        'touchmove',
        'touchstart',
        'transitioncancel',
        'transitionend',
        'transitionrun',
        'transitionstart',
        'webkitmouseforcechanged', // Non-standard
        'webkitmouseforcedown', // Non-standard
        'webkitmouseforceup', // Non-standard
        'webkitmouseforcewillbegin', // Non-standard
        'wheel',
        ...Object.keys(window)
          .filter((propName) => propName.startsWith('on'))
          .map((eventName) => eventName.slice(2)),
      ]),
    ];

    setEventNames([...events]);
  }, []);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    eventNames.forEach((eventName) => {
      target.addEventListener(eventName, handler);
    });

    return () => {
      eventNames.forEach((eventName) => {
        target.removeEventListener(eventName, handler);
      });
    };
  }, [eventNames, handler]);

  useEffect(() => {
    const targets = [inputRef.current, requiredInputRef.current];

    targets.forEach((target) => {
      if (!target) {
        return;
      }

      inputElementEvents.forEach((eventName) => {
        target.addEventListener(eventName, handler);
      });
    });

    return () => {
      targets.forEach((target) => {
        inputElementEvents.forEach((eventName) => {
          target?.removeEventListener(eventName, handler);
        });
      });
    };
  }, [handler]);

  useEffect(() => {
    const target = videoRef.current;

    if (!target) {
      return;
    }

    mediaElementEvents.forEach((eventName) => {
      target.addEventListener(eventName, handler);
    });

    setVideoSrc({ src: '/tools/dom-events-watcher/sample.mp4' });

    return () => {
      mediaElementEvents.forEach((eventName) => {
        target.removeEventListener(eventName, handler);
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
            <p className="mb-2">form要素には以下のイベントに関するハンドラを登録しています。</p>

            <ul className="mb-8 pl-6">
              {eventNames.sort().map((eventName) => {
                return (
                  <li className="mb-1 list-disc pl-1" key={eventName}>
                    {eventName}
                  </li>
                );
              })}
            </ul>

            <p className="mb-2">input要素には以下のイベントに関するハンドラを登録しています。</p>

            <ul className="mb-8 pl-6">
              {inputElementEvents.sort().map((eventName) => {
                return (
                  <li className="mb-1 list-disc pl-1" key={eventName}>
                    {eventName}
                  </li>
                );
              })}
            </ul>

            <p className="mb-2">video要素には以下のイベントに関するハンドラを登録しています。</p>

            <ul className="pl-6">
              {mediaElementEvents.sort().map((eventName) => {
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

      <div className="gap-6 lg:flex lg:h-min">
        <div className="relative lg:min-w-[375px] lg:max-w-[375px]">
          <form
            ref={ref}
            className="border-secondary max-h-[30vh] overflow-y-scroll border border-solid p-4 pb-8 lg:absolute lg:left-0 lg:top-0 lg:h-full lg:max-h-none"
            tabIndex={0}
            id="container"
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
                  ref={inputRef}
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
                  ref={requiredInputRef}
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
                  ref={videoRef}
                  {...videoSrc}
                  controls
                  muted
                  className="aspect-video h-auto w-96 max-w-full"
                ></video>
              </p>

              <figcaption>ミュートされた音声ありのサンプル動画（2.86秒）</figcaption>
            </figure>

            <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-8 text-center">
              <p>
                <button type="button" className="min-w-64 rounded-lg bg-orange-300 px-4 py-2">
                  何も起こらないただのボタン
                </button>
              </p>

              <p>
                <button type="submit" className="min-w-64 rounded-lg bg-orange-300 px-4 py-2">
                  送信ボタン
                </button>
              </p>
            </div>
          </form>
        </div>

        <section>
          <h2 className="mb-2 block w-fit font-bold lg:mt-0">
            <strong id={`${id}-log-title`}>ログ</strong>（最大300行）
          </h2>

          <p>最後の作業から１秒経過すると、次の操作時にタイムスタンプの行が挿入されます。</p>
          <p className="mb-3">イベントを受け取った要素名、イベント名、一部補足情報が出力されます。</p>

          <div
            className="h-[30vh] overflow-y-scroll bg-gray-200 py-2 sm:h-[50vh]"
            tabIndex={0}
            aria-labelledby={`${id}-log-title`}
          >
            <div
              className="grid grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_auto_1fr]"
              style={{
                counterReset: 'log',
              }}
            >
              {log.map((item, index) => {
                if (typeof item === 'string') {
                  return (
                    <p key={item} className="col-[1/4] my-1 grid bg-gray-300 px-2 text-right text-xs sm:col-[1/5]">
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
                    className="keep-all col-[1/4] my-1 grid grid-cols-subgrid grid-rows-[auto_auto] px-2 text-xs leading-tight before:col-[1/2] before:pr-3 before:font-mono before:content-[counter(log)] sm:col-[1/5] sm:grid-cols-subgrid sm:before:text-right"
                    style={{
                      counterIncrement: 'log',
                    }}
                  >
                    <span className="col-[2/3] row-[1/2] pr-3 text-center leading-[inherit] sm:col-[2/3] sm:row-[1/2]">
                      <code className="block sm:inline">{tagName}</code>
                    </span>
                    <span className="col-[3/4] row-[1/2] sm:col-[3/4] sm:row-[1/2]">
                      {name}
                      {times && ` x ${times}`}
                    </span>
                    {options && (
                      <span className="col-[2/4] row-[2/3] leading-[inherit] text-orange-800 sm:col-[4/5] sm:row-[1/2] sm:pl-4">
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
