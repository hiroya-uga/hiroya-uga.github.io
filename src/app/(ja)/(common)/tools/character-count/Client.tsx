'use client';

import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';

import styles from '@/app/(ja)/(common)/tools/character-count/Client.module.css';
import { RunButton } from '@/components/Clickable';
import { Switch } from '@/components/Form';
import { Heading } from '@/components/Heading';

const HALF_CHARACTERS_REGEXP = /\s|\d|[a-z]/;
const VERTICAL_CHARACTERS_REGEXP = /\d|[a-zA-Zａ-ｚＡ-Ｚ]/;
const END_KAKKO_REGEXP = /[」』】）］｝〉》]$/;
const BREAK_SKIP = '__BREAK_SKIP__';
const isSegmenterSupported = typeof Intl.Segmenter === 'function';
const segmenter = isSegmenterSupported
  ? new Intl.Segmenter('ja-JP', { granularity: 'grapheme' })
  : {
      segment(value: string) {
        return [...value].map((segment) => ({
          segment,
        }));
      },
    };

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

const Character = ({ value }: { value: string }) => {
  const characters = [...segmenter.segment(value)].map(({ segment }) => segment);
  const output = characters.length === 1 ? characters.join('') : characters[0];
  const special = characters.length === 2 ? characters[1] : '';
  const isVerticalRl = /[、。「」『』【】（）［］｛｝〈〉《》ー～ゃゅょぁぃぅぇぉァィゥェォッャュョヮヵヶ]/.test(value);

  if (HALF_CHARACTERS_REGEXP.test(special)) {
    return (
      <span className={clsx(['grid grid-cols-2', isVerticalRl ? 'vertical-rl' : 'rotate-90'])}>
        <span>{output}</span>
        <span className="col-start-2 col-end-3">{special}</span>
      </span>
    );
  }

  return (
    <>
      <span
        className={clsx([isVerticalRl ? 'vertical-rl' : VERTICAL_CHARACTERS_REGEXP.test(output) && 'block rotate-90'])}
      >
        {output}
      </span>
      {special && (
        <span
          className={clsx([
            'absolute bottom-0 left-0',
            isVerticalRl && 'vertical-rl',
            special === '。' && 'translate-x-[0.6em] translate-y-[-0.15em]',
            special === '、' && 'translate-x-[0.6em] translate-y-[-0.15em]',
            (output === '。' || output === '、') && (special === '」' || special === '』')
              ? 'translate-x-[0.25em] translate-y-[0.25em]'
              : 'translate-x-[0.175em] translate-y-[0.5em]',
            ,
          ])}
        >
          {special}
        </span>
      )}
    </>
  );
};

const DEFAULT_FONT_SIZE = '16';
let cache = '';

export const CharacterCountContent = ({ id }: { id: string }) => {
  const [currentValue, setCurrentValue] = useState('');
  const [value, setValue] = useState(currentValue);
  const [stringLength, setStringLength] = useState(0);

  const [isFirstView, setIsFirstView] = useState(true);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isAutoCount, setIsAutoCount] = useState(true);
  const [isHalfWidthCount, setIsHalfWidthCount] = useState(false);
  const [isStrict, setIsStrict] = useState(true);

  const [countPages, setCountPages] = useState(1);

  useEffect(() => {
    setCountPages(document.getElementById('原稿用紙イメージ')?.querySelectorAll('h3').length ?? 1);
  }, [value]);

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
          isStrict,
        }),
      );
    } catch {}
  }, [currentValue, fontSize, isAutoCount, isFirstView, isHalfWidthCount, value, isStrict]);

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
        setIsStrict(saveData.isStrict ?? false);
        setStringLength((cache ?? '').length);
      }
    } catch {}
  }, [isFirstView]);

  const getSegmentedCharacters = useCallback(
    (string: string) => {
      const ROW = 20;
      const SPACE = '　';
      const COMBINED = '___COMBINED___';
      // console.log('%cSTART%c', 'background: #fff; color: red; font-size: 200%;', '');
      const formattedCharacters = [...segmenter.segment(string || '　')].map(({ segment }) => {
        // 正規化
        if (isStrict) {
          {
            if (segment !== '\n' && /\s/.test(segment)) {
              return '　';
            }
          }
          {
            if (segment === '〜') {
              return '～';
            }
          }
          {
            const halfWidthKakko = ['(', ')'];
            const fullWidthKakko = ['（', '）'];
            const index = halfWidthKakko.findIndex((item) => item === segment);

            if (index !== -1) {
              return fullWidthKakko[index] ?? segment;
            }
          }
          {
            const kanjiNumbers = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
            const fullWidthNumbers = ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'];
            const fullIndex = fullWidthNumbers.findIndex((item) => item === segment);

            if (fullIndex !== -1) {
              return kanjiNumbers[fullIndex] ?? segment;
            }
          }
          {
            const halfWidthChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            const fullWidthChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              .split('')
              .map((char) => String.fromCharCode(char.charCodeAt(0) + 65248))
              .join('');
            const index = halfWidthChars.findIndex((item) => item === segment);

            if (index !== -1) {
              return fullWidthChars[index] ?? segment;
            }
          }
          {
            const fullWidthChars = 'abcdefghijklmnopqrstuvwxyz'
              .split('')
              .map((char) => String.fromCharCode(char.charCodeAt(0) + 65248));

            if (fullWidthChars.includes(segment)) {
              const halfWidthChars = 'abcdefghijklmnopqrstuvwxyz';
              const index = fullWidthChars.findIndex((item) => item === segment);

              if (index !== -1) {
                return halfWidthChars[index] ?? segment;
              }
            }
          }
        }

        return segment;
      });

      let counter = ROW;
      // console.log(formattedCharacters);

      const nonResolvedBreakLinesCharacters = formattedCharacters.flatMap((character, index, self) => {
        /** 原稿用紙に合わせる */
        const format = () => {
          const prev = self[index - 1];
          const next = self[index + 1];
          const combineWithNext = () => {
            const result = character + (next ?? '');
            self[index + 1] = COMBINED;
            return result;
          };

          // 直前の行の改行が省略されている、または改行なので、現在は行頭
          if (prev === BREAK_SKIP || prev === '\n') {
            counter = ROW;
          }

          if (counter < 1) {
            counter = ROW;
          }

          const isLastChar = counter <= 1;

          // console.log({ counter, character, prev, next });

          // 直前の文字と結合されているためスキップし、なかったこととする
          if (character === COMBINED) {
            counter++;
            return [];
          }

          // 省略改行のため単純にスキップする
          if (character === BREAK_SKIP) {
            return [];
          }

          // 改行を受け取ったが、直前の文字が改行ではなく、かつ行頭であるときはスキップする
          if (character === '\n' && prev !== '\n' && counter === ROW) {
            return [];
          }

          // console.log({ character, isLastChar });

          const checkNotHalfCharacterSibling = (value?: string) => {
            return value !== '\n' && HALF_CHARACTERS_REGEXP.test(value ?? '');
          };

          const isNextKutoten = self[index + 1] === '。' || self[index + 1] === '、';
          const isNextKakkotoji = END_KAKKO_REGEXP.test(self[index + 1]);
          const isHalfCharacterSibling =
            checkNotHalfCharacterSibling(character) && checkNotHalfCharacterSibling(self[index + 1]);

          if (isLastChar) {
            // console.log('%c行頭%c', 'background: #fff; color: #000; font-size: 200%;', '');

            if (isNextKutoten || isNextKakkotoji) {
              return combineWithNext();
            }
          } else {
            const isCharKutoten = character === '。' || character === '、';

            if (isCharKutoten && isNextKakkotoji) {
              return combineWithNext();
            }
          }

          if (isHalfCharacterSibling) {
            return combineWithNext();
          }

          return character;
        };

        const result = isStrict ? format() : character;

        if (isStrict) {
          counter--;
        }

        return result;
      });

      // カウンタの初期化
      counter = ROW;

      // console.log(nonResolvedBreakLinesCharacters);

      const characters = nonResolvedBreakLinesCharacters.flatMap((character) => {
        if (character === '\n') {
          const result = [...''.padEnd(counter, SPACE)];
          counter = ROW;
          return result;
        }

        counter--;

        if (counter < 1) {
          counter = ROW;
        }

        return character;
      });

      const result = [];

      for (let i = 0; i < characters.length; i += 400) {
        const container = [];
        let chunk400 = characters.slice(i, i + 400);

        if (chunk400.length !== 400) {
          chunk400 = [...chunk400, ...[...new Array(400)].map(() => SPACE)].slice(0, 400);
        }

        for (let j = 0; j < chunk400.length; j += 20) {
          container.push([...chunk400.slice(j, j + 20)]);
        }

        result.push(container);
      }

      return result;
    },
    [isStrict],
  );

  return (
    <div className={clsx(['transition-[opacity,visibility] md:mt-28', isFirstView ? 'invisible opacity-0' : ''])}>
      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div>
          <div className="md:sticky md:top-8">
            <Heading level={2}>
              <label htmlFor={id}>本文</label>
            </Heading>
            {!isSegmenterSupported && (
              <p className="text-2xs text-alert mb-3 font-bold leading-relaxed">
                <strong className="flex">
                  <span>※</span>
                  <span>
                    サポート外のブラウザのようです。一部の特殊文字が正確にカウントできないため、Google
                    Chromeなどのブラウザをご利用ください。
                  </span>
                </strong>
              </p>
            )}
            <p className="mb-3">
              <textarea
                id={id}
                className="border-secondary bg-secondary h-[max(5lh,23vh)] min-h-[108px] w-full resize-y rounded-md border px-4 py-2"
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
                    setStringLength(currentTarget.value.length);
                  }

                  setCurrentValue(currentTarget.value);
                }}
              />
            </p>
            <ul className="flex justify-between gap-4">
              <li className="relative z-20">
                <RunButton
                  type="button"
                  onClick={() => {
                    setCurrentValue('');
                    setValue('');
                  }}
                  afterIcon="reload"
                >
                  リセット
                </RunButton>
              </li>
              <li className={clsx(['transition-fade relative z-20', isAutoCount && 'invisible opacity-0'])}>
                <RunButton
                  type="button"
                  onClick={() => {
                    setValue(currentValue);
                  }}
                >
                  文字数を数える
                </RunButton>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-sm sm:grid sm:grid-cols-[60%_40%] md:block lg:text-base">
            <div className="mt-16 sm:mt-0 sm:pr-14">
              <Heading level={2}>結果</Heading>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 md:grid-cols-[auto_auto]">
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-文字数`}>
                    文字数
                  </label>
                  <output
                    id={`${id}-文字数`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {countCharacters({ value, isHalfWidthCount })}
                  </output>
                </p>
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-文字数（空白文字を除く）`}>
                    文字数（空白文字を除く）
                  </label>
                  <output
                    id={`${id}-文字数（空白文字を除く）`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {countCharacters({ value, isIgnoreWhitespace: true, isHalfWidthCount })}
                  </output>
                </p>
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-行数`}>
                    行数
                  </label>
                  <output id={`${id}-行数`} className="border-secondary bg-secondary rounded-md border px-2 text-base">
                    {countLines({ value })}
                  </output>
                </p>
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-行数（空行を除く）`}>
                    行数（空行を除く）
                  </label>
                  <output
                    id={`${id}-行数（空行を除く）`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {countLines({ value, isIgnoreEmptyLines: true })}
                  </output>
                </p>
                <p className="col-span-full grid grid-cols-subgrid">
                  <span className="grow">
                    <label htmlFor={`${id}-原稿用紙換算（400文字）`}>原稿用紙換算（400文字）</label>×
                  </span>
                  <output
                    id={`${id}-原稿用紙換算（400文字）`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {countPages}枚
                  </output>
                </p>
                <hr className="col-span-full mt-2 pb-2" />
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-length`}>
                    length (String.length)
                  </label>
                  <output
                    id={`${id}-length`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {stringLength}
                  </output>
                </p>
                <p className="col-span-full grid grid-cols-subgrid">
                  <label className="grow" htmlFor={`${id}-バイト数（UTF-8)`}>
                    バイト数（UTF-8）
                  </label>
                  <output
                    id={`${id}-バイト数（UTF-8）`}
                    className="border-secondary bg-secondary rounded-md border px-2 text-base"
                  >
                    {countBytes({ value })}
                  </output>
                </p>
              </div>
            </div>

            <div className="mt-16">
              <Heading level={2}>設定</Heading>
              <p className="mb-4 text-right">
                <label>
                  文字サイズ
                  <input
                    type="number"
                    value={fontSize}
                    className="border-secondary mx-2 w-12 rounded-md border px-2 text-right"
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

              <p className="mb-4 text-right">
                <label className="flex items-center gap-2">
                  <span className="grow">半角文字は２文字で１文字としてカウント</span>
                  <span>
                    <Switch checked={isHalfWidthCount} dispatch={setIsHalfWidthCount} />
                  </span>
                </label>
              </p>

              <p className="text-right">
                <label className="flex items-center gap-2">
                  <span className="grow">原稿用紙のルールを有効にする（実験中）</span>
                  <span>
                    <Switch checked={isStrict} dispatch={setIsStrict} />
                  </span>
                </label>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 md:col-span-2">
          <Heading level={2}>原稿用紙イメージ</Heading>

          <div id="原稿用紙イメージ">
            {getSegmentedCharacters(value).map((container, containerIndex) => {
              return (
                <React.Fragment key={containerIndex}>
                  <h3 className="not-first:mt-8 mb-4 text-lg">{`${containerIndex + 1}件`}</h3>

                  <div className="sm:pl-2">
                    <p
                      className="text-2xs not-last:mb-24 mx-auto w-min max-w-full overflow-auto sm:text-base"
                      key={containerIndex}
                      tabIndex={0}
                      aria-label={container.flatMap((array) => array).join('')}
                    >
                      <span
                        className="bg-secondary relative mx-auto block w-fit pr-1 text-center before:absolute before:left-0 before:top-0 before:w-full before:border-t before:border-solid before:border-t-[orange] dark:before:border-t-[orange]/80"
                        style={{
                          borderRight: '1px solid orange',
                          borderBottom: '1px solid orange',
                        }}
                      >
                        <span
                          className={clsx([
                            'grid w-fit grid-cols-[repeat(21,1fr)] grid-rows-[repeat(20,1fr)] gap-x-1 leading-none',
                            'before:row-end-21 before:row-start-1 before:border-l before:border-l-[orange] dark:before:border-l-[orange]/80',
                            'before:col-start-11 before:col-end-12',
                          ])}
                          key={containerIndex}
                        >
                          <>
                            <span
                              aria-hidden={true}
                              className={clsx([
                                'col-start-11 col-end-12 row-start-6 row-end-7 text-center',
                                'vertical-rl pl-3px text-justify text-[orange] dark:text-[orange]/80',
                              ])}
                            >
                              【
                            </span>
                            <span
                              aria-hidden={true}
                              className={clsx([
                                'row-start-15 row-end-17 col-start-11 col-end-12 text-center',
                                'vertical-rl pl-3px text-justify text-[orange] dark:text-[orange]/80',
                              ])}
                            >
                              】
                            </span>

                            {container.map((valueSet, colIndexOrigin) => {
                              return valueSet.map((character, rowIndex) => {
                                const colIndex = 10 <= colIndexOrigin ? colIndexOrigin + 1 : colIndexOrigin;

                                return (
                                  <span
                                    key={`${colIndex}_${rowIndex}`}
                                    className={clsx([
                                      'relative box-content block min-h-[1.2ic] w-[1.2ic] overflow-hidden p-1 leading-none',
                                      styles.char,
                                    ])}
                                    style={{
                                      gridColumnStart: 21 - colIndex,
                                      gridColumnEnd: 22 - colIndex,
                                      gridRowStart: rowIndex + 1,
                                      gridRowEnd: rowIndex + 1 + 1,
                                    }}
                                  >
                                    <Character value={character} />
                                  </span>
                                );
                              });
                            })}
                          </>
                        </span>
                      </span>
                    </p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
