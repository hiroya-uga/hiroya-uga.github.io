'use client';

import { Details } from '@/components/Box';
import { Switch } from '@/components/Form';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

const countHalfWidthCharacters = (value: string) => {
  const halfWidthRegex = /[ -~]/g;
  return value.match(halfWidthRegex)?.length ?? 0;
};

const countCharacters = ({
  value,
  isIgnoreWhitespace,
  isHalfWidthCount,
}: {
  value: string;
  isIgnoreWhitespace?: boolean;
  isHalfWidthCount?: boolean;
}) => {
  const halfWidthLength = isHalfWidthCount ? countHalfWidthCharacters(value) / 2 : 0;
  const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'grapheme' });
  const string = isIgnoreWhitespace ? value.replace(/\s/g, '') : value.replace(/\n/g, '');

  return [...segmenter.segment(string)].length - halfWidthLength;
};

const countLines = ({ value, isIgnoreEmptyLines }: { value: string; isIgnoreEmptyLines?: boolean }) => {
  const lines = value.split(/\r\n|\r|\n/);

  if (isIgnoreEmptyLines) {
    return lines.filter((line) => line.trim() !== '').length;
  }

  return lines.length;
};

const countBytes = ({ value }: { value: string }) => {
  return new Blob([value]).size;
};

const countPages = ({ value }: { value: string }) => {
  const charCount = countCharacters({ value });
  return Math.ceil(charCount / 400);
};

const DEFAULT_FONT_SIZE = '16';
let cache = '';

export const CharacterCountContent = ({ id }: { id: string }) => {
  const [currentValue, setCurrentValue] = useState('');
  const [value, setValue] = useState(currentValue);

  const [isFirstView, setIsFirstView] = useState(true);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isAutoCount, setIsAutoCount] = useState(false);
  const [isHalfWidthCount, setIsHalfWidthCount] = useState(false);

  useEffect(() => {
    if (isFirstView) {
      setIsFirstView(false);
      return;
    }

    try {
      localStorage.setItem(
        'character-count',
        JSON.stringify({
          currentValue,
          fontSize,
          isAutoCount,
          isHalfWidthCount,
        }),
      );
    } catch {}
  }, [currentValue, fontSize, isAutoCount, isFirstView, isHalfWidthCount, value]);

  useEffect(() => {
    try {
      if (isFirstView) {
        const saveData = JSON.parse(localStorage.getItem('character-count') ?? '');

        cache = saveData.currentValue ?? '';
        setValue(cache);
        setCurrentValue(cache);
        setFontSize(saveData.fontSize ?? '16');
        setIsAutoCount(saveData.isAutoCount);
        setIsHalfWidthCount(saveData.isHalfWidthCount ?? false);
      }
    } catch {}
  }, [isFirstView]);

  return (
    <div className={clsx(['transition-[opacity_visibility]', isFirstView ? 'invisible opacity-0' : ''])}>
      <h2>
        <label htmlFor={id}>本文</label>
      </h2>

      <p className="mb-3">
        <textarea
          id={id}
          className="h-[max(5lh,23vh)] min-h-[108px] w-full resize-y border border-gray-600 px-4 py-2"
          style={{
            fontSize: Boolean(fontSize) ? `${fontSize}px` : DEFAULT_FONT_SIZE,
          }}
          value={currentValue}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
              if (isAutoCount) {
                setValue(cache);
              }

              setCurrentValue(cache);
            }
          }}
          onChange={({ currentTarget }) => {
            cache = currentTarget.value;

            if (isAutoCount) {
              setValue(currentTarget.value);
            }

            setCurrentValue(currentTarget.value);
          }}
        />
      </p>

      <p className="text-right">
        <button
          type="button"
          onClick={() => {
            setValue(currentValue);
          }}
          className={clsx([
            'relative z-20 mr-4 rounded border border-black bg-[rgba(255,255,255,.6)] px-8 py-2',
            'transition-[opacity_visibility]',
            isAutoCount && 'invisible opacity-0',
          ])}
        >
          文字数を数える
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentValue('');
            setValue('');
          }}
          className="relative z-20 rounded border border-black bg-[rgba(255,255,255,.6)] px-8 py-2"
        >
          リセット
        </button>
      </p>

      <div className="mt-24 grid-cols-[60%_40%] text-sm sm:grid lg:text-base">
        <div className="mb-24 sm:mb-0 sm:pr-14">
          <h2 className="mt-0">結果</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 md:w-fit md:grid-cols-2">
            <p className="col-span-full grid grid-cols-subgrid">
              <label className="grow" htmlFor={`${id}-文字数`}>
                文字数
              </label>
              <output id={`${id}-文字数`} className="border border-gray-400 bg-white px-2 text-base">
                {countCharacters({ value, isHalfWidthCount })}
              </output>
            </p>
            <p className="col-span-full grid grid-cols-subgrid">
              <label className="grow" htmlFor={`${id}-文字数（空白文字を除く）`}>
                文字数（空白文字を除く）
              </label>
              <output id={`${id}-文字数（空白文字を除く）`} className="border border-gray-400 bg-white px-2 text-base">
                {countCharacters({ value, isIgnoreWhitespace: true, isHalfWidthCount })}
              </output>
            </p>
            <p className="col-span-full grid grid-cols-subgrid">
              <label className="grow" htmlFor={`${id}-行数`}>
                行数
              </label>
              <output id={`${id}-行数`} className="border border-gray-400 bg-white px-2 text-base">
                {countLines({ value })}
              </output>
            </p>
            <p className="col-span-full grid grid-cols-subgrid">
              <label className="grow" htmlFor={`${id}-行数（空行を除く）`}>
                行数（空行を除く）
              </label>
              <output id={`${id}-行数（空行を除く）`} className="border border-gray-400 bg-white px-2 text-base">
                {countLines({ value, isIgnoreEmptyLines: true })}
              </output>
            </p>
            <p className="col-span-full grid grid-cols-subgrid">
              <span className="grow">
                <label htmlFor={`${id}-原稿用紙換算（400文字）`}>原稿用紙換算（400文字）</label>×
              </span>
              <output id={`${id}-原稿用紙換算（400文字）`} className="border border-gray-400 bg-white px-2 text-base">
                {countPages({ value })}枚
              </output>
            </p>
            <p className="col-span-full grid grid-cols-subgrid">
              <label className="grow" htmlFor={`${id}-バイト数（UTF`}>
                バイト数（UTF-8）
              </label>
              <output id={`${id}-バイト数（UTF`} className="border border-gray-400 bg-white px-2 text-base">
                {countBytes({ value })}
              </output>
            </p>
          </div>
        </div>

        <div>
          <h2 className="mt-0">設定</h2>
          <p className="mb-4 text-right">
            <label>
              文字サイズ
              <input
                type="number"
                value={fontSize}
                className="mx-2 w-12 border border-gray-400 px-2 text-right"
                onChange={({ currentTarget }) => {
                  const currentValue = currentTarget.value;

                  if (isNaN(Number(currentValue))) {
                    setFontSize(DEFAULT_FONT_SIZE);
                    return;
                  }

                  setFontSize(currentValue);
                }}
                onBlur={({ currentTarget }) => {
                  const currentValue = currentTarget.value;

                  if (currentValue === '') {
                    setFontSize(DEFAULT_FONT_SIZE);
                  }
                }}
              />
              px
            </label>
          </p>

          <p className="mb-4 text-right">
            <label className="flex items-center gap-2">
              <span className="grow">リアルタイムカウント</span>
              <span>
                <Switch checked={isAutoCount} dispatch={setIsAutoCount} />
              </span>
            </label>
          </p>

          <p className="text-right">
            <label className="flex items-center gap-2">
              <span className="grow">半角文字は２文字で１文字としてカウント</span>
              <span>
                <Switch checked={isHalfWidthCount} dispatch={setIsHalfWidthCount} />
              </span>
            </label>
          </p>
        </div>
      </div>
    </div>
  );
};
