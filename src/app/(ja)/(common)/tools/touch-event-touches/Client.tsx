'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { NoteBox } from '@/components/Box';

type Touches = Record<
  string,
  {
    y: number;
    x: number;
    force: number;
  }
>;

const TouchPoints = ({ dataSets }: { dataSets: Touches }) => {
  return (
    <>
      {Object.entries(dataSets).map(([touchId, { x, y, force }]) => {
        const forceValue = (() => {
          if (force) {
            const [before, after] = `${Math.floor(force * 100000) / 1000}`.split('.');
            const beforeValue = before.padStart(2, '0');
            const afterValue = beforeValue === '100' ? '' : `.${after?.slice(0, 3) ?? '000'}`.padEnd(4, '0');

            return `${beforeValue}${afterValue}%`;
          }

          return 'not supported';
        })();

        return (
          <div
            key={touchId}
            className="pointer-events-none fixed left-0 top-0 z-20 ml-[-1.75cm] mt-[-1.75cm] block size-[3.5cm] select-none border border-solid border-red-600 p-1 text-2xs"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className="absolute bottom-full left-0 whitespace-nowrap pb-1 text-2xs leading-none">
              <div>Y: {y}</div>
              <div>X: {x}</div>
            </div>

            <div className="absolute bottom-full left-0 whitespace-nowrap pb-1 text-2xs leading-none">
              <div>Y: {y}</div>
              <div>X: {x}</div>
            </div>

            <div className="absolute -left-[2.4rem] top-0 rotate-90">
              <div className="absolute bottom-full left-0 whitespace-nowrap text-2xs leading-none">
                <div>Y: {y}</div>
                <div>X: {x}</div>
              </div>
            </div>

            <div className="absolute left-0 top-full whitespace-nowrap pt-1 text-2xs leading-none">
              <div>Y: {y}</div>
              <div>X: {x}</div>
            </div>

            <div className="absolute -right-[2.4rem] bottom-0 -rotate-90">
              <div className="absolute bottom-full left-0 whitespace-nowrap text-2xs leading-none">
                <div>Y: {y}</div>
                <div>X: {x}</div>
              </div>
            </div>

            <div className="absolute left-0 top-full -rotate-90">
              <div className="absolute bottom-full left-0 whitespace-nowrap">ID: {touchId}</div>
            </div>

            <div className="absolute left-1 top-1 text-2xs leading-none">force: {forceValue}</div>

            <div className="absolute bottom-1 right-1 text-2xs leading-none">force: {forceValue}</div>

            <div className="absolute left-full top-[0.85rem] rotate-90">
              <div className="absolute -left-[0.85rem] bottom-full whitespace-nowrap">ID: {touchId}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const TouchEventTouchesContent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | undefined>();
  const [touchDataSet, setTouchDataSet] = useState<Touches>({});

  const ref = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
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
          force: touch.force,
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
    const startButton = startButtonRef.current;
    const option: AddEventListenerOptions = {
      passive: false,
    };

    container?.addEventListener('click', preventDefault, option);
    container?.addEventListener('touchstart', ontouchstartAndMove, option);
    container?.addEventListener('touchmove', ontouchstartAndMove, option);
    container?.addEventListener('touchend', ontouchend, option);
    startButton?.addEventListener('touchend', ontouchend, option);

    return () => {
      container?.removeEventListener('click', preventDefault, option);
      container?.removeEventListener('touchstart', ontouchstartAndMove, option);
      container?.removeEventListener('touchmove', ontouchstartAndMove, option);
      container?.removeEventListener('touchend', ontouchend, option);
      startButton?.removeEventListener('touchend', ontouchend, option);
    };
  }, [isRunning, loop, touchDataSet]);

  return (
    <>
      <div
        className={clsx([
          isRunning ? 'sticky bottom-4' : 'relative',
          'z-20',
          'before:touch-none] before:fixed before:left-0 before:top-0 before:-z-10 before:size-full before:bg-[rgba(255,255,255,.9)] before:transition-[visibility,opacity]',
          !isRunning && 'before:invisible before:opacity-0',
        ])}
      >
        <div
          className={clsx([
            'rounded p-2 py-3 sm:p-6',
            'flex flex-wrap items-center justify-center gap-2 transition-[background-color,visibility,opacity]',
            isTouchDevice !== true && 'invisible opacity-0',
            isRunning ? 'bg-[rgba(255,255,255,.9)]' : 'bg-[rgba(255,255,255,.9)]',
          ])}
        >
          <p
            className={clsx([
              'grow transition-[visibility,opacity] sm:text-left',
              isRunning !== true && 'invisible opacity-0',
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
              ref={startButtonRef}
              className={clsx([
                'relative z-20 rounded border border-black bg-[rgba(255,255,255,.6)] px-8 py-2',
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
          className={clsx(['mx-2 mt-2 transition-[visibility,opacity] sm:mx-6', isRunning || 'invisible opacity-0'])}
        >
          <NoteBox headingLevel={2} logLevel="warn">
            <p>このページは現在、Stopボタン以外のタッチ操作が無効になっています。</p>
          </NoteBox>
        </div>

        <div className={clsx([isRunning && 'touch-none] fixed left-0 top-0 z-10 size-full'])} ref={ref}>
          <TouchPoints dataSets={touchDataSet} />
        </div>
      </div>

      <p
        role="alert"
        className={clsx([
          'pb-8 text-center transition-[visibility,opacity]',
          isTouchDevice !== false && 'invisible opacity-0',
        ])}
      >
        残念ながら、お使いのデバイスは タッチ操作をサポート<strong>していない</strong>ようです。
      </p>
    </>
  );
};
