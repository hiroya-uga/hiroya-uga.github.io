'use client';

import { useEffect, useRef, useState } from 'react';

const getNow = () => {
  const date = new Date();

  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(
    2,
    '0',
  )}`;
};

let key = -1;

export const DOMEventWatcherContent = ({ id }: { id: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [timestamp, setTimestamp] = useState(getNow());
  const [value, setValue] = useState<[[string, string], ...string[]]>([['', timestamp]]);

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
        'beforematch',
        'Experimental',
        'beforescriptexecute', // Non-standard
        'beforexrselect',
        'Experimental',
        'blur',
        'click',
        'compositionend',
        'compositionstart',
        'compositionupdate',
        'contentvisibilityautostatechange',
        'Experimental',
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
        'pointerrawupdate',
        'Experimental',
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
    const handler = (e: Event) => {
      clearInterval(key);

      key = window.setInterval(() => {
        setTimestamp(getNow());
      }, 1000);

      const eventName = (() => {
        if (e instanceof KeyboardEvent) {
          return `${e.type} (key = '${e.key}')`;
        }

        return e.type;
      })();

      if (e.type === 'drop') {
        e.preventDefault();
      }

      const rest = (value.slice(1) as string[]).map((val) => val.replace('@@@', ' x ')).slice(0, 299);

      if (value[0][0].startsWith(eventName)) {
        const [first] = value;
        const [_, countString] = first[0].split('@@@');
        const count = Number(countString);

        if (Number.isNaN(count)) {
          setValue([[`${eventName}@@@2`, timestamp], ...rest]);

          return;
        }

        setValue([[`${eventName}@@@${count + 1}`, timestamp], ...rest]);

        return;
      }

      const result = [value[0][0], ...rest];

      if (timestamp === value[0][1]) {
        setValue([[eventName, timestamp], ...result]);

        return;
      }

      setValue([[eventName, timestamp], `#${timestamp}`, ...result]);
    };

    events.forEach((eventName) => {
      ref.current?.addEventListener(eventName, handler);
    });

    return () => {
      events.forEach((eventName) => {
        ref.current?.removeEventListener(eventName, handler);
      });
    };
  }, [timestamp, value]);

  return (
    <>
      <div ref={ref} className="overflow-scroll max-h-[30vh] p-4 border border-solid border-gray-400" tabIndex={0}>
        <div className="min-h-[40vh]">
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
              autoComplete="none"
              aria-describedby={`${id}-description`}
              placeholder="hogehoge"
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

          <p className="text-center touch-none p-8 border border-solid border-gray-400">
            タッチイベントを無視するp要素
          </p>
        </div>

        <p className="mt-12 text-center">
          <button type="button" className="bg-orange-300 rounded-lg px-4 py-2">
            何も起こらないただのボタン
          </button>
        </p>
      </div>

      <h2 className="block w-fit mb-2 font-bold">ログ（最大300行）</h2>

      <p className="mb-2">最後の作業から１秒経過すると、タイムスタンプの行が挿入されます。</p>

      <div className="h-[30vh] py-2 overflow-y-scroll bg-gray-200">
        <div
          className="grid grid-cols-[auto_1fr]"
          style={{
            counterReset: 'log',
          }}
        >
          {value
            .map((item) => {
              const eventName = typeof item === 'string' ? item : item[0];

              return eventName.replace('@@@', ' x ');
            })
            .map((eventName, index) => {
              if (eventName.startsWith('#')) {
                return (
                  <p key={eventName} className="text-right bg-gray-300 px-2 my-1 col-start-1 col-end-3 grid">
                    {eventName.slice(1)}
                  </p>
                );
              }
              return (
                <p
                  key={index}
                  className="pl-2 before:content-[counter(log)] col-start-1 col-end-3 before:col-start-1 before:col-end-2 grid grid-cols-[subgrid] grid-rows-[subgrid] before:text-center before:pr-2"
                  style={{
                    counterIncrement: 'log',
                  }}
                >
                  <span className="col-start-2 col-end-3">{eventName}</span>
                </p>
              );
            })}
        </div>
      </div>
    </>
  );
};
