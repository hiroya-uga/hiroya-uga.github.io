'use client';
import { RunButton } from '@/components/Clickable';
import { useCallback, useRef, useState } from 'react';

import styles from '@/app/(ja)/(common)/tools/kaprekar-number/Client.module.css';
import { TextField } from '@/components/Form';
import clsx from 'clsx';

const calculateKaprekar = (inputNumber: number) => {
  const numberString = String(Math.abs(inputNumber));

  const minValue = [...numberString].sort().join('');
  const maxValue = [...minValue].reverse().join('');
  const minNumber = parseInt(minValue, 10);
  const maxNumber = parseInt(maxValue, 10);
  const difference = maxNumber - minNumber;

  return {
    difference,
    maxValue,
    minValue,
    next: Number(String(difference).padEnd(numberString.length, '0')),
  };
};

export const KaprekarNumberContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [maxTimes, setMaxTimes] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const intervalId = useRef(-0);
  const currentNumberRef = useRef(0);

  const startCalculation = useCallback(
    (options?: { abort?: true }) => {
      const container = containerRef.current;
      const input = inputRef.current;
      const result = resultRef.current;
      const count = countRef.current;

      if (!container || !input || !result || !count) {
        return;
      }

      if (options?.abort) {
        container?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clearInterval(intervalId.current);
        setIsRunning(false);
        result.insertAdjacentHTML('beforeend', '<p class="text-[#ffa7a7] text-base">処理を中断します。</p>');
        setErrorMessage('エラー：中断ボタンが押されました。');
        return;
      }

      const inputNumber = Number(input.value.trim());

      if (input.value.trim() === '' || isNaN(inputNumber)) {
        setErrorMessage('エラー：有効な数値を入力してください。');
        return;
      }

      if (inputNumber < 0) {
        setErrorMessage('エラー：10以上の数値を入力してください。');
        return;
      }

      if (10 < inputNumber && new Set(input.value).size < 2) {
        setErrorMessage('エラー：ゾロ目以外の数値を入力してください。');
        return;
      }

      setErrorMessage('');

      setIsRunning(true);
      result.textContent = '';
      currentNumberRef.current = inputNumber;

      let i = 0;
      const calculate = () => {
        const { difference, maxValue, minValue: originMinValue, next } = calculateKaprekar(currentNumberRef.current);

        const splitMinValue = originMinValue.replace(/^(0+)([^0])/, '$1,$2').split(',');
        const minValue =
          splitMinValue.length === 1 ? splitMinValue.join('') : `<span>${splitMinValue[0]}</span>${splitMinValue[1]}`;

        const p = document.createElement('p');
        p.insertAdjacentHTML(
          'beforeend',
          `
        <span>${maxValue}</span>
        <span>-</span>
        <span>${minValue}</span>
        <span>=</span>
        <span>${difference}</span>
      `,
        );
        result.append(p);

        if (i < maxTimes) {
          count.textContent = String(i + 1);

          if (currentNumberRef.current === next) {
            result.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            clearInterval(intervalId.current);
            setIsRunning(false);
            result.insertAdjacentHTML(
              'beforeend',
              '<p class="text-green-500 text-base" role="alert">カプレカ数に到達しました！</p>',
            );
            return;
          }

          result.lastElementChild?.scrollIntoView({ behavior: 'instant', block: 'end' });
          currentNumberRef.current = next;
          i++;

          return;
        }

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clearInterval(intervalId.current);
        setIsRunning(false);
        result.insertAdjacentHTML('beforeend', '<p class="text-[#ffa7a7] text-base">処理を中断します。</p>');
        setErrorMessage(`エラー：${maxTimes}回操作しましたが、カプレカ数に到達しませんでした。`);
      };

      intervalId.current = window.setInterval(calculate, 40);
      calculate();
    },
    [maxTimes],
  );

  return (
    <>
      <TextField
        label="最大試行回数"
        type="number"
        value={String(maxTimes)}
        onInput={(e) => setMaxTimes(Number(e.currentTarget.value))}
        onBlur={(e) => setMaxTimes(Number(e.currentTarget.value) || 100)}
        readOnly={isRunning}
        description="途中式が画面に出力されるため、膨大な試行回数を設定すると、ブラウザがフリーズする可能性があります。"
      />
      <div className="pt-paragraph" ref={containerRef}>
        <div className="grid min-h-[90dvh] grid-rows-[1fr_auto] rounded-lg bg-[#303030] px-6 pb-16 pt-2 text-[#f1f1f1] sm:pt-4">
          <div>
            <form
              className="mb-6"
              onSubmit={
                isRunning
                  ? (e) => {
                      e.preventDefault();
                      startCalculation({ abort: true });
                      startCalculation();
                    }
                  : (e) => {
                      e.preventDefault();
                      startCalculation();
                    }
              }
            >
              <p className="border-b border-solid border-[#575757]">
                <label className="text-sm text-[#bebebe]">
                  <span className="mb-2 block">0以上の好きな整数を半角数字で入力してください。</span>
                  <input
                    ref={inputRef}
                    className="block w-full rounded-lg bg-transparent px-[16px] text-center text-[10vw] text-[#f1f1f1] caret-[#f1f1f1] placeholder:text-[#575757]"
                    placeholder="168"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                    onFocus={() => {
                      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  />
                </label>
              </p>
            </form>

            <p role="alert" className="min-h-[1lh] text-[#ffa7a7] transition-opacity empty:opacity-0">
              {errorMessage}
            </p>

            <div ref={resultRef} className={clsx([styles.result, 'mt-[0.25em] space-y-[0.25em] font-mono'])} />
          </div>

          <div className="pointer-events-none sticky bottom-2  items-center sm:bottom-6 sm:grid sm:grid-cols-[1fr_auto_1fr]">
            <p className="pointer-events-auto col-start-2 mx-auto mt-6 w-fit transition-opacity">
              <RunButton
                type="button"
                onClick={isRunning ? () => startCalculation({ abort: true }) : () => startCalculation()}
                aria-live="polite"
              >
                {isRunning ? '中断する' : '計算する'}
              </RunButton>
            </p>
            <p className="mt-2 content-center text-right text-xs">
              試行回数：
              <span ref={countRef} className="mx-1 font-mono">
                0
              </span>
              回
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
