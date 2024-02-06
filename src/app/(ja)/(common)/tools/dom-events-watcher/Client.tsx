'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  const [timestamp, setTimestamp] = useState(getNow());
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [value, setValue] = useState<[[string, string, string], ...([string, string] | string)[]]>([
    ['', '', timestamp],
  ]);

  const handler = useCallback(
    (e: Event) => {
      clearInterval(key);
      key = window.setInterval(() => {
        setTimestamp(getNow());
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

      const rest = value
        .slice(1)
        .map((item) => {
          if (typeof item === 'string') {
            return item.replace('@@@', ' x ');
          }

          return [...item];
        })
        .slice(0, 299) as [string, string][];

      if (value[0][0] === tagName && value[0][1].startsWith(eventName)) {
        const [first] = value;
        const [_, countString] = first[1].split('@@@');
        const count = Number(countString);

        if (Number.isNaN(count)) {
          setValue([[tagName, `${eventName}@@@2`, timestamp], ...rest]);

          return;
        }

        setValue([[tagName, `${eventName}@@@${count + 1}`, timestamp], ...rest]);

        return;
      }

      const result = [[value[0][0], value[0][1]], ...rest] as ([string, string] | string)[];

      if (timestamp === value[0][2]) {
        setValue([[tagName, eventName, timestamp], ...result]);

        return;
      }

      setValue([[tagName, eventName, timestamp], timestamp, ...result]);
    },
    [timestamp, value],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

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

    const target = ref.current;

    setEventNames([...events]);

    events.forEach((eventName) => {
      target?.addEventListener(eventName, handler);
    });

    return () => {
      events.forEach((eventName) => {
        target?.removeEventListener(eventName, handler);
      });
    };
  }, [handler, timestamp, value]);

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

  return (
    <>
      <p className="mb-2">
        このページの
        <a href="#container" id={`${id}-title`}>
          いろんなイベントを受け取るフォーカス・スクロール可能なform要素
        </a>
        内のUIを操作すると、JavaScriptがどのようなイベントを受け取るのかを確認できます。
      </p>

      <p className="mb-8">
        イベントハンドラを持っている要素はform要素のみですが、一部のイベントによってはバブリングしないため直接イベントを受け取る要素にハンドラを登録しています。
      </p>

      <details className="rounded border border-slate-400 overflow-hidden bg-white mb-28">
        <summary className="p-4 bg-slate-200 sm:hover:bg-slate-300 sm:transition-colors sm:duration-200">
          サポートしているイベントタイプ
        </summary>

        <div className="max-h-[70vh] overflow-y-scroll py-4 px-8">
          <p className="mb-2">このページで採用されているイベント一覧です。一部非標準、非推奨も含まれています。</p>
          <p className="mb-2">form要素には以下のイベントに関するハンドラを登録しています。</p>

          <ul className="pl-6 mb-8">
            {eventNames.sort().map((eventName) => {
              return (
                <li className="list-disc pl-1 mb-1" key={eventName}>
                  {eventName}
                </li>
              );
            })}
          </ul>

          <p className="mb-2">input要素には以下のイベントに関するハンドラを登録しています。</p>

          <ul className="pl-6 mb-8">
            {inputElementEvents.sort().map((eventName) => {
              return (
                <li className="list-disc pl-1 mb-1" key={eventName}>
                  {eventName}
                </li>
              );
            })}
          </ul>

          <p className="mb-2">video要素には以下のイベントに関するハンドラを登録しています。</p>

          <ul className="pl-6">
            {mediaElementEvents.sort().map((eventName) => {
              return (
                <li className="list-disc pl-1 mb-1" key={eventName}>
                  {eventName}
                </li>
              );
            })}
          </ul>
        </div>
      </details>

      <div className="sm:flex gap-6 sm:h-[50vh]">
        <form
          ref={ref}
          className="overflow-y-scroll max-h-[30vh] p-4 pb-8 border border-solid border-gray-400 sm:max-h-none sm:max-w-[375px]"
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

            <p className="text-center touch-none p-8 border border-solid border-gray-400 mb-8">
              タッチイベントを無視するp要素
            </p>

            <p>
              <label htmlFor={id} className="block w-fit mb-2 font-bold">
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
                className="p-4 border border-solid border-gray-500 rounded w-full"
              />
            </p>

            <p>
              <label htmlFor={`${id}-required`} className="block w-fit mb-2 font-bold">
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
                className="p-4 border border-solid border-gray-500 rounded w-full"
              />
            </p>

            <fieldset className="mb-8">
              <legend className="block w-fit mb-2 font-bold">ラジオボタン</legend>
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
              <legend className="block w-fit mb-2 font-bold">チェックボタン</legend>
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
                className="w-96 h-auto aspect-video max-w-full"
              ></video>
            </p>

            <figcaption>ミュートされた音声ありのサンプル動画（2.86秒）</figcaption>
          </figure>

          <div className="mt-12 text-center flex flex-wrap justify-center gap-x-12 gap-y-8">
            <p>
              <button type="button" className="bg-orange-300 rounded-lg px-4 py-2 min-w-[16rem]">
                何も起こらないただのボタン
              </button>
            </p>

            <p>
              <button type="submit" className="bg-orange-300 rounded-lg px-4 py-2 min-w-[16rem]">
                送信ボタン
              </button>
            </p>
          </div>
        </form>

        <section>
          <h2 className="block w-fit mb-2 font-bold sm:mt-0">
            <strong id={`${id}-log-title`}>ログ</strong>（最大300行）
          </h2>

          <p>最後の作業から１秒経過すると、次の操作時にタイムスタンプの行が挿入されます。</p>
          <p className="mb-3">イベントを受け取った要素名、イベント名、一部補足情報が出力されます。</p>

          <div className="h-[30vh] py-2 overflow-y-scroll bg-gray-200" tabIndex={0} aria-labelledby={`${id}-log-title`}>
            <div
              className="grid grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_auto_1fr]"
              style={{
                counterReset: 'log',
              }}
            >
              {value.map((item, index) => {
                if (typeof item === 'string') {
                  return (
                    <p key={item} className="text-right bg-gray-300 px-2 my-1 col-[1_/_4] sm:col-[1_/_5] grid">
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
                    className="px-2 before:content-[counter(log)] col-[1_/_4] sm:col-[1_/_5] before:col-[1_/_2] grid grid-cols-[subgrid] grid-rows-[auto_auto] sm:grid-cols-[subgrid] sm:before:text-right before:font-mono before:pr-3 keep-all my-2 sm:my-0"
                    style={{
                      counterIncrement: 'log',
                    }}
                  >
                    <span className="col-[2_/_3] row-[1_/_2] sm:row-[1_/_2] sm:col-[2_/_3] pr-3 text-center">
                      <code className="block sm:inline">{tagName}</code>
                    </span>
                    <span className="col-[3_/_4] row-[1_/_2] sm:row-[1_/_2] sm:col-[3_/_4]">
                      {name}
                      {times && ` x ${times}`}
                    </span>
                    {options && (
                      <span className="text-orange-800 sm:pl-4 col-[2_/_4] row-[2_/_3] sm:row-[1_/_2] sm:col-[4_/_5]">
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
