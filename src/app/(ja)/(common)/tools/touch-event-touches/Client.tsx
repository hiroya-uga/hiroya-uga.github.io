'use client';

import { NoteBox } from '@/components/Box';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

type Touches = Record<
  string,
  {
    y: number;
    x: number;
  }
>;

const TouchPoints = ({ dataSets }: { dataSets: Touches }) => {
  return (
    <>
      {Object.entries(dataSets).map(([touchId, { x, y }]) => (
        <div
          key={touchId}
          className="fixed top-0 left-0 z-20 block w-[2.6cm] h-[2.6cm] p-1 mt-[-1.3cm] ml-[-1.3cm] text-2xs pointer-events-none border border-red-600 border-solid select-none"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <span className="text-2xs whitespace-nowrap absolute left-0 bottom-full">Y: {y}</span>
          <span className="absolute top-full left-0 -rotate-90">
            <span className="absolute bottom-full -left-[0.85rem] whitespace-nowrap">ID: {touchId}</span>
          </span>
          <span className="text-2xs whitespace-nowrap absolute left-0 top-full">X: {x}</span>
        </div>
      ))}
    </>
  );
};

export const TouchEventTouchesContent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>();
  const [touchDataSet, setTouchDataSet] = useState<Touches>({});

  const ref = useRef<HTMLDivElement>(null);
  const requestAnimationFrameId = useRef<number>(0);
  const loop = useCallback(() => {
    requestAnimationFrameId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (isRunning) {
      loop();
    } else if (requestAnimationFrameId.current) {
      cancelAnimationFrame(requestAnimationFrameId.current);
    }

    const preventDefault = (e: MouseEvent | TouchEvent) => {
      if (isRunning) {
        e.preventDefault();
      }
    };
    const update = (e: TouchEvent) => {
      const touches = {} as Touches;

      for (const touch of e.touches) {
        touches[touch.identifier] = {
          x: touch.clientX,
          y: touch.clientY,
        };
      }

      setTouchDataSet({
        ...touchDataSet,
        ...touches,
      });
    };
    const ontouchstartAndMove = (e: TouchEvent) => {
      if (!isRunning) {
        return;
      }

      e.preventDefault();
      update(e);
    };
    const ontouchend = (e: TouchEvent) => {
      const idList = [...e.touches].map(({ identifier }) => identifier);
      const touches = {
        ...touchDataSet,
      };

      for (const id of Object.keys(touches)) {
        if (!idList.includes(Number(id))) {
          delete touches[id];
        }
      }

      setTouchDataSet({
        ...touches,
      });
    };
    const container = ref.current;
    const option: AddEventListenerOptions = {
      passive: false,
    };

    container?.addEventListener('click', preventDefault, option);
    container?.addEventListener('touchstart', ontouchstartAndMove, option);
    container?.addEventListener('touchmove', ontouchstartAndMove, option);
    container?.addEventListener('touchend', ontouchend, option);

    return () => {
      container?.removeEventListener('click', preventDefault, option);
      container?.removeEventListener('touchstart', ontouchstartAndMove, option);
      container?.removeEventListener('touchmove', ontouchstartAndMove, option);
      container?.removeEventListener('touchend', ontouchend, option);
    };
  }, [isRunning, loop, touchDataSet]);

  return (
    <>
      <div
        className={clsx([
          isRunning ? 'sticky bottom-4' : 'relative',
          'z-20',
          'before:fixed before:left-0 before:top-0 before:w-full before:h-full before:-z-10 before:touch-none] before:bg-[rgba(255,255,255,.9)] before:transition-[visibility,opacity]',
          !isRunning && 'before:invisible before:opacity-0',
        ])}
      >
        <div
          className={clsx([
            'p-2 py-3 rounded sm:p-6',
            'transition-[background-color,visibility,opacity] flex flex-wrap justify-center gap-2 items-center',
            isTouchDevice !== true && 'opacity-0 invisible',
            isRunning ? 'bg-[rgba(255,255,255,.9)]' : 'bg-[rgba(255,255,255,.9)]',
          ])}
        >
          <p
            className={clsx([
              'grow sm:text-left transition-[visibility,opacity]',
              isRunning !== true && 'opacity-0 invisible',
            ])}
          >
            認識している指の本数：
            <span aria-live="polite" aria-atomic="true">
              {Object.keys(touchDataSet).length}本
            </span>
          </p>

          <p>
            <button
              aria-live="assertive"
              className={clsx([
                'relative z-20 border border-black rounded py-2 px-8 bg-[rgba(255,255,255,.6)]',
                isRunning && 'touch-none',
              ])}
              onClick={(e) => {
                e.stopPropagation();
                setIsRunning(!isRunning);
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>
          </p>
        </div>

        <div
          aria-live="assertive"
          aria-busy={typeof isTouchDevice === 'undefined'}
          className={clsx(['transition-[visibility,opacity] mt-2 mx-2 sm:mx-6', isRunning || 'opacity-0 invisible'])}
        >
          <NoteBox headingLevel={2} logLevel="warn">
            <p>このページは現在、Stopボタン以外のタッチ操作が無効になっています。</p>
          </NoteBox>
        </div>

        <div className={clsx([isRunning && 'fixed left-0 top-0 w-full h-full z-10 touch-none]'])} ref={ref}>
          <TouchPoints dataSets={touchDataSet} />
        </div>
      </div>

      <p
        role="alert"
        className={clsx([
          'text-center transition-[visibility,opacity] pb-8',
          isTouchDevice !== false && 'invisible opacity-0',
        ])}
      >
        残念ながら、お使いのデバイスは タッチ操作をサポート<strong>していない</strong>ようです。
      </p>
    </>
  );
};
