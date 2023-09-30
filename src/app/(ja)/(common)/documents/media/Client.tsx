'use client';

import { mediaCategory, mediaTags, mediaTypes } from '@/constants/media';
import { externalMediaLinkList } from '@/data/externalMediaLinkList';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

const CheckBoxes = <T extends string>({
  nameSet,
  stateSet,
  dispatch,
}: {
  nameSet: readonly T[];
  stateSet: {
    [_ in (typeof nameSet)[number]]: boolean;
  };
  dispatch: React.Dispatch<
    SetStateAction<{
      [_ in (typeof nameSet)[number]]: boolean;
    }>
  >;
}) => {
  return nameSet.map((key) => {
    const checked = stateSet[key];

    return (
      <li key={key} className="w-32">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 inline-block"
            checked={checked}
            onChange={() => {
              dispatch({
                ...stateSet,
                [key]: !checked,
              });
            }}
          />
          <span>{key}</span>
        </label>
      </li>
    );
  });
};

const Title = ({ title, keyword }: { title: string; keyword: string }) => {
  type KeywordData = { word: string; start: number; end: number };

  const input = keyword.trim();

  if (input === '') {
    return <>{title}</>;
  }

  const patterns = [...new Set(input.split(/\s/))]
    .map((word) => {
      if (word.trim()) {
        return new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ui');
      }

      return null;
    })
    .filter((nullableRegExp): nullableRegExp is RegExp => Boolean(nullableRegExp));

  const indexSet = patterns
    .map((regExp) => {
      const matched = title.match(regExp);

      if (!matched) {
        return null;
      }

      const word = matched[0];
      const index = matched.index || 0;

      return {
        word,
        start: index,
        end: index + word.length,
      };
    })
    .filter((result): result is KeywordData => Boolean(result))
    .sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start;
      }

      if (a.word.length !== b.word.length) {
        return b.word.length - a.word.length;
      }

      return b.end - a.end;
    })
    .reduce(
      (previous, current) => {
        if (previous.end <= current.start) {
          return {
            result: [...previous.result, current],
            end: current.end,
          };
        }

        return previous;
      },
      { result: [] as KeywordData[], end: 0 },
    ).result;

  const { result } = indexSet.reduce(
    (previous, { word, start, end }, index) => {
      const { result, readIndex } = previous;
      const currentMatched = title.slice(start, end);

      if (end <= readIndex) {
        console.log({ start, end, readIndex, title, word });
        return previous;
      }

      if (indexSet.length - 1 === index) {
        return {
          result: [
            ...result,
            { text: title.slice(readIndex, start), marked: false },
            { text: currentMatched, marked: true },
            { text: title.slice(end), marked: false },
          ],
          readIndex: end,
        };
      }

      return {
        result: [
          ...result,
          { text: title.slice(readIndex, start), marked: false },
          { text: currentMatched, marked: true },
        ],
        readIndex: end,
      };
    },
    {
      result: [] as { text: string; marked: boolean }[],
      readIndex: 0,
    },
  );

  return (
    <>
      {result.map(({ text, marked }) => {
        if (marked) {
          return <mark key={text}>{text}</mark>;
        }

        return <React.Fragment key={text}>{text}</React.Fragment>;
      })}
    </>
  );
};

const getDefaultCheckedState = <T extends string>(nameSet: readonly T[]) => {
  const entries = nameSet.map((key) => {
    return [key, false] as const;
  });

  return Object.fromEntries(entries) as {
    [_ in (typeof nameSet)[number]]: boolean;
  };
};

const resetStatus = <T extends Record<string, boolean>>(status: T) => {
  return Object.fromEntries(Object.keys(status).map((key) => [key, false])) as T;
};

export const MediaContent = ({ id }: { id: string }) => {
  const idForKeywords = `${id}text`;
  const idForFilterTitle = `${id}filterTitle`;

  const [typesStatus, setTypesStatus] = useState(getDefaultCheckedState(mediaTypes));
  const [categoriesStatus, setCategoriesStatus] = useState(getDefaultCheckedState(mediaCategory));
  const [tagsStatus, setTagsStatus] = useState(getDefaultCheckedState(mediaTags));
  const [keyword, setKeyword] = useState('');

  const isSelectedTypes = Object.values({
    ...typesStatus,
  }).some((value) => value === true);

  const isSelectedCategories = Object.values({
    ...categoriesStatus,
  }).some((value) => value === true);

  const isSelectedTags = Object.values({
    ...tagsStatus,
  }).some((value) => value === true);

  const result = externalMediaLinkList
    .filter(({ type }) => {
      if (!isSelectedTypes) {
        return true;
      }

      return typesStatus[type];
    })
    .filter(({ category }) => {
      if (!isSelectedCategories) {
        return true;
      }

      return categoriesStatus[category];
    })
    .filter(({ tags }) => {
      if (!isSelectedTags) {
        return true;
      }

      return tags?.some((tag) => {
        return tagsStatus[tag];
      });
    })
    .filter((listItem) => {
      if (!keyword) {
        return true;
      }

      const { title } = {
        title: listItem.title.toLowerCase(),
        // category: listItem.category.toLowerCase(),
        // date: listItem.date.toLowerCase(),
        // href: listItem.href.toLowerCase(),
        // tags: (listItem.tags?.join('') || '').toLowerCase(),
      };

      const lowerKeyWords = keyword.toLowerCase().trim().split(/\s/);
      const isMatched = lowerKeyWords.some((lowerKeyWord) => {
        return title.includes(lowerKeyWord);
        // title.includes(lowerKeyWord) ||
        // category.includes(lowerKeyWord) ||
        // date.includes(lowerKeyWord) ||
        // href.includes(lowerKeyWord) ||
        // tags.includes(lowerKeyWord)
      });

      return isMatched;
    });

  return (
    <>
      <nav aria-labelledby={idForFilterTitle} className="mb-28">
        <details className="rounded border border-slate-400 overflow-hidden bg-slate-50">
          <summary className="p-4 bg-slate-200 sm:hover:bg-slate-300 sm:transition-colors sm:duration-200">
            <h2 className="m-0 text-lg" id={idForFilterTitle}>
              絞り込む
            </h2>
          </summary>

          <div className="p-6 pb-8 sm:p-8 sm:pt-7 sm:pb-9">
            <div className="flex flex-row-reverse mb-6 sm:mb-10">
              <p className="relative left-2 bottom-2 min-w-[9rem] text-right">
                <button
                  type="reset"
                  className="py-2 px-3 bg-slate-200 rounded sm:hover:bg-slate-300 sm:transition-colors sm:duration-200"
                  onClick={() => {
                    setTypesStatus(resetStatus<typeof typesStatus>(typesStatus));
                    setTagsStatus(resetStatus<typeof tagsStatus>(tagsStatus));
                    setCategoriesStatus(resetStatus<typeof categoriesStatus>(categoriesStatus));
                  }}
                >
                  すべてクリア
                </button>
              </p>
              <fieldset className="grow">
                <legend className="font-bold mb-3">Types</legend>
                <ul className="flex flex-wrap gap-2 pl-4">
                  <CheckBoxes nameSet={mediaTypes} stateSet={typesStatus} dispatch={setTypesStatus} />
                </ul>
              </fieldset>
            </div>

            <fieldset className="mb-6 sm:mb-10">
              <legend className="font-bold mb-3">Categories</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaCategory} stateSet={categoriesStatus} dispatch={setCategoriesStatus} />
              </ul>
            </fieldset>

            <fieldset className="mb-6 sm:mb-10">
              <legend className="font-bold mb-3">Tags</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaTags} stateSet={tagsStatus} dispatch={setTagsStatus} />
              </ul>
            </fieldset>

            <p className="flex pr-2">
              <label htmlFor={idForKeywords} className="font-bold mr-2">
                <span className="block py-2 pr-2">Keywords</span>
              </label>
              <span className="grow">
                <input
                  id={idForKeywords}
                  className="w-full p-2 border border-slate-400 rounded"
                  value={keyword}
                  onChange={({ currentTarget }) => {
                    setKeyword(currentTarget.value);
                  }}
                />
              </span>
            </p>
          </div>
        </details>
      </nav>

      <section>
        <div className="flex items-end leading-none mb-8">
          <h2 className="m-0">メディア一覧</h2>

          <p className="ml-4" aria-live="assertive" aria-atomic="true" aria-relevant="all">
            {result.length}/{externalMediaLinkList.length}件
          </p>
        </div>

        <table className="mb-2 block sm:table">
          <tbody className="block sm:table-row-group">
            {result.map(({ date, category, title, href, tags }) => {
              return (
                <tr key={href} className="leading-6 sm:leading-7 grid grid-cols-[auto_1fr] sm:table-row">
                  <td className="font-mono text-xs leading-[inherit] sm:text-sm block col-start-1 col-end-2 sm:table-cell">
                    <span className="inline-block">{date}</span>
                  </td>
                  <td className="pl-4 font-mono sm:text-center uppercase text-xs leading-[inherit] sm:px-8 col-start-2 col-end-3 block sm:table-cell">
                    <span className="inline-block">{category}</span>
                  </td>
                  <td className="pb-6 text-sm leading-[inherit] sm:text-base sm:pb-8 col-start-1 col-end-3 block sm:table-cell">
                    <p>
                      <a href={href} className="break-all">
                        <Title title={title} keyword={keyword} />
                      </a>
                    </p>

                    <p className="text-xs text-gray-600 text-ellipsis overflow-hidden">{href}</p>

                    {tags && tags.length && (
                      <ul className="text-xs mt-3 flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          return (
                            <li key={tag}>
                              <span className="p-1 bg-slate-200">{tag}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
};
