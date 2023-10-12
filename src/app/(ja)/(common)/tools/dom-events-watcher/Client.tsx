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
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [value, setValue] = useState<[[string, string, string], ...([string, string] | string)[]]>([
    ['', '', timestamp],
  ]);

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
    const handler = (e: Event) => {
      clearInterval(key);

      const tagName = e.target instanceof HTMLElement ? e.target.tagName.toLocaleLowerCase() : 'unknown';

      key = window.setInterval(() => {
        setTimestamp(getNow());
      }, 1000);

      const eventName = (() => {
        if (e instanceof KeyboardEvent) {
          const { altKey, ctrlKey, metaKey, shiftKey } = e;
          return `${e.type}__options__(${JSON.stringify({
            key: e.key,
            altKey,
            ctrlKey,
            metaKey,
            shiftKey,
          })})`;
        }

        if (e instanceof InputEvent) {
          return `${e.type}__options__(${JSON.stringify({
            data: e.data,
          })})`;
        }

        return e.type;
      })();

      if (e.type === 'drop') {
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
    };
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
  }, [timestamp, value]);

  return (
    <>
      <details className="rounded border border-slate-400 overflow-hidden bg-slate-50 mb-28">
        <summary className="p-4 bg-slate-200 sm:hover:bg-slate-300 sm:transition-colors sm:duration-200">
          サポートしているイベントタイプ
        </summary>

        <div className="max-h-[30vh] overflow-y-scroll py-4 px-8">
          <ul className="pl-1">
            {eventNames.sort().map((eventName) => {
              return (
                <li className="list-disc pl-1 mb-1" key={eventName}>
                  {eventName}
                </li>
              );
            })}
          </ul>
        </div>
      </details>

      <div
        ref={ref}
        className="overflow-y-scroll max-h-[30vh] p-4 border border-solid border-gray-400"
        tabIndex={0}
        id="container"
      >
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
          className="grid grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_1fr_auto]"
          style={{
            counterReset: 'log',
          }}
        >
          {value
            .map((item) => {
              if (typeof item === 'string') {
                return item;
              }

              return [item[0], item[1].replace('@@@', ' x ')];
            })
            .map((item, index) => {
              if (typeof item === 'string') {
                return (
                  <p key={item} className="text-right bg-gray-300 px-2 my-1 col-[1_/_4] sm:col-[1_/_5] grid">
                    at {item}
                  </p>
                );
              }

              const [tagName, eventName] = item;
              const [name, options] = eventName.split('__options__');

              return (
                <p
                  key={index}
                  className="px-2 before:content-[counter(log)] col-[1_/_4] sm:col-[1_/_5] before:col-[1_/_2] grid grid-cols-[subgrid] grid-rows-[auto_auto] sm:grid-cols-[subgrid] sm:before:text-right before:font-mono before:pr-3 break-all my-2 sm:my-0"
                  style={{
                    counterIncrement: 'log',
                  }}
                >
                  <span className="col-[2_/_3] row-[1_/_2] sm:row-[1_/_2] sm:col-[2_/_3] pr-3 text-center">
                    <code>{tagName}</code>
                  </span>
                  <span className="col-[3_/_4] row-[1_/_2] sm:row-[1_/_2] sm:col-[3_/_4]">{name}</span>
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
    </>
  );
};
