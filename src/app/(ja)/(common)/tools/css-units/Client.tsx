'use client';

import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

const ABSOLUTE = {
  px: 'ピクセル（1px = 1in/96）',
  pt: 'ポイント（1pt = 1in/72）',
  pc: 'パイカ（1pc = 1in/6）',
  in: 'インチ（1in = 2.54cm = 96px）',
  Q: 'クオーター（1/4）ミリメートル（1Q = 1mm/4）',
  mm: 'ミリメートル（1mm = 1cm/10）',
  cm: 'センチメートル（1cm = 96px/2.54）',
};

const RELATIVE = {
  // 相対
  em: 'その要素の文字サイズ（一部のプロパティは親の要素を参照します）',
  ex: 'その要素のフォントの文字「x」の高さ',
  cap: 'その要素のフォントの大文字の高さ（Cap height）',
  ch: (
    <>
      その要素のフォントの文字「0（U+0030）」の<em>送り幅</em>
    </>
  ),
  ic: (
    <>
      その要素のフォントの文字「水（U+6C34）」の<em>送り幅</em>
    </>
  ),
  lh: 'その要素の行の高さ',
  rem: 'ルート要素の文字サイズ（一部のプロパティは親の要素を参照します）',
  rex: 'ルート要素のフォントの文字「x」の高さ',
  rcap: 'ルート要素のフォントの大文字の高さ（Cap height）',
  rch: (
    <>
      ルート要素のフォントの文字「0（U+0030）」の<em>送り幅</em>
    </>
  ),
  ric: (
    <>
      ルート要素のフォントの文字「水（U+6C34）」の<em>送り幅</em>
    </>
  ),
  rlh: 'ルート要素の行の高さ',
};

const VIEWPORT = {
  vw: ['Viewport幅の1%'],
  svw: ['Small viewportの幅の1%'],
  lvw: ['Large viewportの幅の1%'],
  dvw: ['Dynamic viewportの幅の1%'],

  vh: ['Viewport高さの1%'],
  svh: ['Small viewportの高さの1%'],
  lvh: ['Large viewportの高さの1%'],
  dvh: ['Dynamic viewportの高さの1%'],

  vi: [
    'ルート要素のインライン方向の大きさの1%',
    <>
      ※ 横書きなら<code>vw</code>と同等、縦書きなら<code>vh</code>と同等
    </>,
  ],
  svi: [
    'Small viewportのインライン方向の大きさの1%',
    <>
      ※ 横書きなら<code>svw</code>と同等、縦書きなら<code>svh</code>と同等
    </>,
  ],
  lvi: [
    'Large viewportのインライン方向の大きさの1%',
    <>
      ※ 横書きなら<code>lvw</code>と同等、縦書きなら<code>lvh</code>と同等
    </>,
  ],
  dvi: [
    'Dynamic viewportのインライン方向の大きさの1%',
    <>
      ※ 横書きなら<code>dvw</code>と同等、縦書きなら<code>dvh</code>と同等
    </>,
  ],
  vb: [
    'ルート要素のブロック方向の大きさの1%',
    <>
      ※ 横書きなら<code>vh</code>と同等、縦書きなら<code>vw</code>と同等
    </>,
  ],
  svb: [
    'Small viewportのブロック方向の大きさの1%',
    <>
      ※ 横書きなら<code>svh</code>と同等、縦書きなら<code>svw</code>と同等
    </>,
  ],
  lvb: [
    'Large viewportのブロック方向の大きさの1%',
    <>
      ※ 横書きなら<code>lvh</code>と同等、縦書きなら<code>lvw</code>と同等
    </>,
  ],
  dvb: [
    'Dynamic viewportのブロック方向の大きさの1%',
    <>
      ※ 横書きなら<code>dvh</code>と同等、縦書きなら<code>dvw</code>と同等
    </>,
  ],
  vmin: [
    <>
      <code>vw</code>または<code>vh</code>（小さい方の値）
    </>,
  ],
  svmin: [
    <>
      <code>svw</code>または<code>svh</code>（小さい方の値）
    </>,
  ],
  lvmin: [
    <>
      <code>lvw</code>または<code>lvh</code>（小さい方の値）
    </>,
  ],
  dvmin: [
    <>
      <code>dvw</code>または<code>dvh</code>（小さい方の値）
    </>,
  ],
  vmax: [
    <>
      <code>vw</code>または<code>vh</code>（大きい方の値）
    </>,
  ],
  svmax: [
    <>
      <code>svw</code>または<code>svh</code>（大きい方の値）
    </>,
  ],
  lvmax: [
    <>
      <code>lvw</code>または<code>lvh</code>（大きい方の値）
    </>,
  ],
  dvmax: [
    <>
      <code>dvw</code>または<code>dvh</code>（大きい方の値）
    </>,
  ],
};

const Line = ({
  value,
  id,
  unit,
  description,
  note,
  shouldShowDescriptions,
  dynamicViewport,
}: {
  value: number;
  id: string;
  unit: string;
  description: React.ReactNode;
  note?: React.ReactNode;
  shouldShowDescriptions: boolean;
  /** dynamic viewport が更新されたのを useEffect で検知するためだけの引数 */
  dynamicViewport?: string;
}) => {
  const [currentWidth, setCurrentWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof ref.current?.clientWidth === 'number') {
      setCurrentWidth(ref.current?.offsetWidth);
    }
  }, [value, dynamicViewport]);

  return (
    <>
      <p
        key={unit}
        className={clsx([
          'sticky -left-2 mb-2 mt-4 pl-2 text-sm leading-snug sm:text-lg',
          'sm:mt-6',
          unit === 'px' && 'font-bold',
        ])}
      >
        <span className="font-mono">
          {value}
          {unit}
        </span>{' '}
        → <span className="font-mono">{currentWidth}px</span>
      </p>

      <div
        ref={ref}
        className={clsx([
          'pointer-events-none relative -z-10 -mt-8 mr-8 block overflow-hidden border-b border-dashed border-black bg-slate-300 pt-7',
          'sm:-mt-10 sm:pt-9',
          'after:absolute after:right-0 after:top-0 after:block after:h-full after:border-r after:border-dashed after:border-black',
        ])}
        style={{
          width: `${value}${unit}`,
        }}
      />

      <div
        id={`${id}-${unit}-description`}
        hidden={!shouldShowDescriptions}
        className={clsx(shouldShowDescriptions && 'sticky left-0')}
      >
        <p className="w-full pr-2 pt-1 text-sm leading-snug sm:pb-4 sm:pt-2 sm:text-base">{description}</p>
        {note && <p className="block text-xs sm:pt-1 sm:text-sm">{note}</p>}
      </div>
    </>
  );
};

export const CSSUnitsContent = ({ id }: { id: string }) => {
  const [value, setValue] = useState(100);
  const [shouldShowDescriptions, setShouldShowDescriptions] = useState(false);

  const [rem, setRem] = useState('00');
  const [em, setEm] = useState('00');
  const [rlh, setRlh] = useState('00');
  const [lh, setLh] = useState('00');

  const [viewport, setViewport] = useState('');
  const [smallViewport, setSmallViewport] = useState('');
  const [largeViewport, setLargeViewport] = useState('');
  const [dynamicViewport, setDynamicViewport] = useState('');

  const vRef = useRef<HTMLSpanElement>(null);
  const svRef = useRef<HTMLSpanElement>(null);
  const lvRef = useRef<HTMLSpanElement>(null);
  const dvRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const controls = [...Object.keys(ABSOLUTE), ...Object.keys(RELATIVE)]
    .map((unit) => {
      return `${id}-${unit}-description`;
    })
    .join(' ');

  useEffect(() => {
    const callback = () => {
      const style = getComputedStyle(document.documentElement);
      setRem(style.fontSize);
      setRlh(style.lineHeight);

      if (lineRef.current) {
        const style = getComputedStyle(lineRef.current);
        setEm(style.fontSize);
        setLh(style.lineHeight);
      }

      if (vRef.current) {
        setViewport(`${vRef.current.clientWidth} x ${vRef.current.clientHeight}`);
      }
      if (svRef.current) {
        setSmallViewport(`${svRef.current.clientWidth} x ${svRef.current.clientHeight}`);
      }
      if (lvRef.current) {
        setLargeViewport(`${lvRef.current.clientWidth} x ${lvRef.current.clientHeight}`);
      }
      if (dvRef.current) {
        setDynamicViewport(`${dvRef.current.clientWidth} x ${dvRef.current.clientHeight}`);
      }
    };

    const key = setInterval(callback, 1000);

    callback();

    return () => {
      clearInterval(key);
    };
  }, []);

  return (
    <>
      <div className="sticky top-2 z-10 mb-2 flex items-center justify-end gap-x-8 rounded bg-white p-4">
        <p className="grow text-base leading-snug">サンプルは横スクロールできます。</p>
        <p>
          <button
            type="button"
            aria-live="assertive"
            aria-controls={controls}
            className="min-w-36 rounded border border-solid border-black p-2 text-sm leading-snug sm:whitespace-nowrap sm:px-4 sm:text-base"
            onClick={() => setShouldShowDescriptions(!shouldShowDescriptions)}
          >
            {shouldShowDescriptions ? '説明文を隠す' : '説明文を表示する'}
          </button>
        </p>
      </div>

      <p className="mb-1 flex text-sm leading-snug sm:text-base">
        <span>※</span>
        <small>「CSS上の値 → px換算」で表示されますが、「px換算」の値は小数点四捨五入です。</small>
      </p>
      <p className="mb-2 flex gap-2 text-sm leading-snug sm:text-base">
        <span>※</span>
        <small>各種viewportの値は1秒ごとに再取得しています。</small>
      </p>

      <div className="relative rounded border border-solid border-black">
        <div className="overflow-x-auto overflow-y-hidden p-4" tabIndex={0}>
          <h2 className="sticky left-0 m-0 mb-2 text-lg font-bold sm:text-2xl">絶対値</h2>

          {Object.entries(ABSOLUTE).map(([unit, description]) => {
            return (
              <Line
                key={unit}
                id={id}
                unit={unit}
                value={value}
                description={description}
                shouldShowDescriptions={shouldShowDescriptions}
              />
            );
          })}

          <h2 className="sticky left-0 m-0 mt-12 text-lg font-bold sm:mb-2 sm:text-2xl">相対値</h2>

          <dl className="sticky left-0 mb-2 grid-cols-[auto_1fr] gap-x-4 text-xs sm:grid sm:gap-y-1 sm:text-base">
            <div className="flex items-end">
              <dt className="mr-1 leading-snug after:content-[':']">サンプルの文字サイズ</dt>
              <dd className="text-sm leading-snug sm:text-lg" ref={lineRef}>
                {em}
              </dd>
            </div>
            <div className="flex items-end">
              <dt className="mr-1 leading-snug after:content-[':']">サンプルの行の高さ</dt>
              <dd className="text-sm leading-snug sm:text-lg">{lh}</dd>
            </div>

            <div className="flex items-end">
              <dt className="mr-1 leading-snug after:content-[':']">ルート要素の文字サイズ</dt>
              <dd className="text-sm leading-snug sm:text-lg">{rem}</dd>
            </div>

            <div className="flex grow items-end">
              <dt className="mr-1 leading-snug after:content-[':']">ルート要素の行の高さ</dt>
              <dd className="text-sm leading-snug sm:text-lg">{rlh}</dd>
            </div>
          </dl>

          {Object.entries(RELATIVE).map(([unit, description]) => {
            return (
              <Line
                key={unit}
                id={id}
                unit={unit}
                value={value}
                description={description}
                shouldShowDescriptions={shouldShowDescriptions}
              />
            );
          })}

          <h3 className="sticky left-0 mt-8 text-lg sm:mb-2 sm:mt-10 sm:text-2xl">
            Viewport
            <span className="pointer-events-none relative block size-0 overflow-hidden">
              <span className="absolute h-screen w-screen" ref={vRef}></span>
              <span className="absolute h-svh w-svw" ref={svRef}></span>
              <span className="absolute h-lvh w-lvw" ref={lvRef}></span>
              <span className="absolute h-dvh w-dvw" ref={dvRef}></span>
            </span>
          </h3>

          <dl className="sticky left-0 mb-2 text-sm sm:text-base">
            <div className="flex items-center sm:items-stretch">
              <dt className="mr-1 after:content-[':'] sm:mr-2">Viewport</dt>
              <dd className="leading-snug sm:text-lg">{viewport}</dd>
            </div>
            <div className="flex items-center sm:items-stretch">
              <dt className="mr-1 after:content-[':'] sm:mr-2">Small Viewport</dt>
              <dd className="leading-snug sm:text-lg">{smallViewport}</dd>
            </div>
            <div className="flex items-center sm:items-stretch">
              <dt className="mr-1 after:content-[':'] sm:mr-2">Large Viewport</dt>
              <dd className="leading-snug sm:text-lg">{largeViewport}</dd>
            </div>
            <div className="flex items-center sm:items-stretch">
              <dt className="mr-1 after:content-[':'] sm:mr-2">Dynamic Viewport</dt>
              <dd className="leading-snug sm:text-lg">{dynamicViewport}</dd>
            </div>
          </dl>

          {Object.entries(VIEWPORT).map(([unit, [description, note]]) => {
            return (
              <Line
                key={unit}
                id={id}
                unit={unit}
                value={value}
                description={description}
                note={note}
                shouldShowDescriptions={shouldShowDescriptions}
                dynamicViewport={dynamicViewport}
              />
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-6 mt-10 flex flex-wrap items-center justify-end gap-x-3 rounded bg-white py-2 pl-4 pr-3">
        <p className="min-w-[200px] grow">
          <input
            type="range"
            value={value}
            id={id}
            aria-labelledby={`${id}-label`}
            min={0}
            max={200}
            className="block h-11 w-full"
            onChange={({ currentTarget }) => {
              setValue(Number(currentTarget.value));
            }}
          />
        </p>
        <p className="w-28">
          <label className="flex flex-wrap gap-x-2 overflow-hidden rounded border border-black pl-1 outline-offset-4 focus-within:outline focus-within:outline-2 focus-within:outline-black">
            <span id={`${id}-label`} className="block text-2xs">
              現在の値
            </span>

            <span className="grow leading-none">
              <input
                type="number"
                min={0}
                max={200}
                value={value}
                className="block w-full pr-2 text-right outline-none"
                onChange={({ currentTarget }) => {
                  const currentValue = Number(currentTarget.value);

                  if (currentValue < 0) {
                    setValue(0);
                  } else if (200 < currentValue) {
                    setValue(200);
                  } else {
                    setValue(currentValue);
                  }

                  // 先頭の0を削除する
                  currentTarget.value = String(currentValue);
                }}
              />
            </span>
          </label>
        </p>
      </div>
    </>
  );
};
