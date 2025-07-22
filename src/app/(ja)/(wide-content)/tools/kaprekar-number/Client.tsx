'use client';
import { RunButton } from '@/components/Clickable';
import { useCallback, useId, useMemo, useRef, useState } from 'react';

import styles from '@/app/(ja)/(wide-content)/tools/kaprekar-number/Client.module.css';
import { TextField } from '@/components/Form';
import { formatStringToNumericString } from '@/utils/formatter';
import clsx from 'clsx';

const calculateKaprekar = (inputNumber: number | bigint) => {
  const numberString = String(inputNumber);

  const minValue = [...numberString].sort().join('');
  const maxValue = [...minValue].reverse().join('');
  const minNumber = BigInt(parseInt(minValue, 10));
  const maxNumber = BigInt(parseInt(maxValue, 10));
  const difference = maxNumber - minNumber;

  return {
    difference,
    maxValue,
    minValue,
    next: BigInt(String(difference).padEnd(numberString.length, '0')),
  };
};

export const KaprekarNumberContent = () => {
  const differenceClassName = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [tryValue, setTryValue] = useState('');
  const [digitsLength, setDigitsLength] = useState(0);
  const [maxTimes, setMaxTimes] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [isOver, setIsOver] = useState(false);
  const set = useMemo(() => new Set<bigint>(), []);

  const intervalId = useRef(-0);
  const currentNumberRef = useRef(BigInt(0));

  const startCalculation = useCallback(
    (options?: { abort?: true }) => {
      const container = containerRef.current;
      const input = inputRef.current;
      const result = resultRef.current;
      const count = countRef.current;

      if (!container || !input || !result || !count) {
        return;
      }

      const showErrorMessage = (message: string) => {
        container?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clearInterval(intervalId.current);
        setIsRunning(false);
        setErrorMessage(message);
      };

      if (options?.abort) {
        result.insertAdjacentHTML('beforeend', '<p class="text-[#ffa7a7] text-base">処理を中断します。</p>');
        showErrorMessage('エラー：中断ボタンが押されました。');
        return;
      }

      const inputNumber = (() => {
        try {
          return BigInt(tryValue.trim());
        } catch {
          return null;
        }
      })();

      if (tryValue.trim() === '' || inputNumber === null) {
        showErrorMessage('エラー：有効な数値を入力してください。');
        return;
      }

      if (inputNumber < 0) {
        showErrorMessage('エラー：10以上の数値を入力してください。');
        return;
      }

      if (10 < inputNumber && new Set(tryValue).size < 2) {
        showErrorMessage('エラー：ゾロ目以外の数値を入力してください。');
        return;
      }

      // 雑init
      setErrorMessage('');
      setResultMessage('');
      set.clear();

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
          <span class="${differenceClassName}">${difference}</span>
        `,
        );
        result.append(p);

        if (set.has(difference) === false) {
          set.add(difference);
        } else if (currentNumberRef.current !== next) {
          // カプレカ数に到達していないのに、同じ数が出てきた場合
          const duplicateString = String(difference);
          showErrorMessage(`エラー：ループしています。${difference}はすでに計算済みの数です。`);
          result.querySelectorAll(`.${differenceClassName}`).forEach((span) => {
            if (span.textContent === duplicateString) {
              const mark = document.createElement('mark');
              mark.textContent = span.textContent;
              span.replaceWith(mark);
            }
          });
          return;
        }

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

        currentNumberRef.current = next; // 続行ボタン用にここでも代入する
        showErrorMessage(`エラー：${maxTimes}回操作しましたが、カプレカ数に到達しませんでした。`);
        setIsOver(true);
      };

      setIsOver(false);
      intervalId.current = window.setInterval(calculate, 40);
      calculate();
    },
    [set, differenceClassName, tryValue, maxTimes],
  );

  return (
    <>
      <form
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
        <div
          ref={containerRef}
          className="grid min-h-[90dvh] grid-rows-[1fr_auto_auto] rounded-lg bg-[#303030] px-6 pb-16 pt-2 text-[#f1f1f1] sm:pt-4"
        >
          <div>
            <div className="mb-6">
              <p className={styles.inputWrapper}>
                <label className="text-sm text-[#bebebe]">
                  <span className="max-w-content mx-auto mb-2 block">
                    0以上の好きな整数を半角数字で入力してください。
                  </span>
                  <input
                    ref={inputRef}
                    className="-mx-6 block w-[calc(100%+3rem)] rounded-lg bg-transparent px-[8px] py-4 text-center text-[min(10vw,50px)] text-[#f1f1f1] caret-[#f1f1f1] placeholder:text-[#575757]"
                    placeholder="168"
                    inputMode="numeric"
                    value={tryValue}
                    onInput={(e) => {
                      e.currentTarget.value = formatStringToNumericString(e.currentTarget.value);
                      setTryValue(e.currentTarget.value);
                      setDigitsLength(e.currentTarget.value.length);
                    }}
                    onFocus={() => {
                      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  />
                </label>
              </p>
            </div>

            <div className="@container">
              <p
                role="alert"
                className="min-h-lh @content:w-full max-w-content mx-auto w-fit text-[#ffa7a7] transition-opacity empty:opacity-0"
              >
                {errorMessage}
              </p>

              <div className="@content:after:w-content mx-auto w-fit after:block after:h-1">
                <div
                  ref={resultRef}
                  className={clsx([styles.result, 'mt-[0.25em] space-y-3 font-mono leading-snug'])}
                />

                <p role="alert" className="min-h-lh text-[#ffa7a7] transition-opacity empty:opacity-0">
                  {resultMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-22 max-w-content text-primary mx-auto mb-6">
          <TextField
            label="最大試行回数"
            inputMode="numeric"
            value={String(maxTimes)}
            onInput={(e) => {
              const value = e.currentTarget.value
                .replace(/[０-９ー]/g, (c) => {
                  return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
                })
                .replace(/^0+|[^0-9-]/g, '');

              setMaxTimes(Number(value));
            }}
            onBlur={(e) => setMaxTimes(Number(e.currentTarget.value) || 100)}
            readOnly={isRunning}
            description="途中式が画面に出力されるため、膨大な試行回数を設定すると、ブラウザがフリーズする可能性があります。"
          />
        </div>

        <div className="pointer-events-none sticky bottom-2 z-10 sm:bottom-6 sm:grid sm:grid-cols-[1fr_16.25rem_1fr] sm:items-end">
          <div className="col-start-2">
            <p className={clsx(['transition-fade', isOver === false && 'invisible opacity-0'])}>
              <RunButton
                type={'button'}
                onClick={(e) => {
                  e.preventDefault();
                  const value = String(currentNumberRef.current);

                  setTryValue(value);
                  setDigitsLength(value.length);
                  startCalculation();
                }}
                afterIcon="/common/images/icons/reload.svg"
              >
                <span className="break-all">{`${currentNumberRef.current}から再開する`}</span>
              </RunButton>
            </p>
            <p className="mt-2 sm:mt-6">
              <RunButton
                type="submit"
                onClick={
                  isRunning
                    ? (e) => {
                        e.preventDefault();
                        startCalculation({ abort: true });
                      }
                    : (e) => {
                        e.preventDefault();
                        startCalculation();
                      }
                }
                aria-live="polite"
              >
                {isRunning ? '中断する' : '計算する'}
              </RunButton>
            </p>
          </div>
          <div className="bg-(--v-color-background)/80 pointer-events-auto ml-auto mr-4 mt-2 w-fit rounded px-2 py-1 text-right text-xs leading-tight">
            <p>
              試行回数：
              <span ref={countRef} className="mx-1 font-mono">
                0
              </span>
              回
            </p>
            <p>
              入力桁数：
              <span className="mx-1 font-mono">{digitsLength}</span>桁
            </p>
          </div>
        </div>
      </form>
    </>
  );
};
