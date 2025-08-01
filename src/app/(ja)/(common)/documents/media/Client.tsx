'use client';

import React, { SetStateAction, useId, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Details } from '@/components/Box';
import { ClearButton } from '@/components/Clickable';
import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { TextField } from '@/components/Form';
import { SvgIcon } from '@/components/Icons';
import { mediaCategory, mediaTags, mediaTypes } from '@/constants/media';
import { externalMediaLinkList } from '@/data/external-media-link-list';
import { createId } from '@/utils/create-id';

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
            className="mr-2 inline-block size-4"
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
    (previous, { start, end }, index) => {
      const { result, readIndex } = previous;
      const currentMatched = title.slice(start, end);

      if (end <= readIndex) {
        // console.log({ start, end, readIndex, title, word });
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

export const MediaContent = () => {
  const id = useId();
  const idForKeywords = `${id}text`;
  const idForFilterTitle = `${id}filterTitle`;

  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const keywordQuery = params?.get('query') ?? '';

  const [typesStatus, setTypesStatus] = useState(getDefaultCheckedState(mediaTypes));
  const [categoriesStatus, setCategoriesStatus] = useState(getDefaultCheckedState(mediaCategory));
  const [tagsStatus, setTagsStatus] = useState(getDefaultCheckedState(mediaTags));
  const [keyword, setKeyword] = useState(keywordQuery);

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
        <Details
          defaultOpen={keywordQuery !== ''}
          id={`${id}-details`}
          summary={
            <h2 className="m-0 text-lg" id={idForFilterTitle}>
              絞り込む
            </h2>
          }
        >
          <div className="@w640:p-8 @w640:pb-9 @w640:pt-7 p-6 pb-8">
            <div className="@w640:mb-10 mb-6 flex flex-row-reverse">
              <p className="relative bottom-2 left-2 min-w-36 text-right">
                <ClearButton
                  onClick={() => {
                    setTypesStatus(resetStatus<typeof typesStatus>(typesStatus));
                    setTagsStatus(resetStatus<typeof tagsStatus>(tagsStatus));
                    setCategoriesStatus(resetStatus<typeof categoriesStatus>(categoriesStatus));
                  }}
                >
                  すべてクリア
                </ClearButton>
              </p>
              <fieldset className="grow">
                <legend className="mb-3 font-bold">Types</legend>
                <ul className="flex flex-wrap gap-2 pl-4">
                  <CheckBoxes nameSet={mediaTypes} stateSet={typesStatus} dispatch={setTypesStatus} />
                </ul>
              </fieldset>
            </div>

            <fieldset className="@w640:mb-10 mb-6">
              <legend className="mb-3 font-bold">Categories</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaCategory} stateSet={categoriesStatus} dispatch={setCategoriesStatus} />
              </ul>
            </fieldset>

            <fieldset className="@w640:mb-10 mb-6">
              <legend className="mb-3 font-bold">Tags</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaTags} stateSet={tagsStatus} dispatch={setTagsStatus} />
              </ul>
            </fieldset>

            <TextField
              label="Keywords"
              value={keyword}
              onInput={({ currentTarget }) => {
                setKeyword(currentTarget.value);

                router.replace(`${pathname ?? window.location.pathname}?query=${currentTarget.value}`, {
                  scroll: false,
                });
              }}
            />
          </div>
        </Details>
      </nav>

      <section>
        <div className="mb-8 flex items-end leading-none">
          <h2 className="m-0">メディア一覧</h2>

          <p className="ml-4" aria-live="assertive" aria-atomic="true" aria-relevant="all">
            {result.length}/{externalMediaLinkList.length}件
          </p>
        </div>

        <ul className="@w640:space-y-4 mb-2 space-y-6">
          {result.map(({ type, date, category, title, href, tags }) => {
            const defaultClickable = createId(id, href);
            return (
              <ClickableArea
                key={href}
                as="li"
                defaultClickable={defaultClickable}
                className="hover:bg-secondary @w640:grid-cols-[6.25rem_4.75rem_1fr] @w640:p-4 @w640:leading-7 grid grid-cols-[auto_1fr] rounded-lg p-2 leading-6 transition-[background-color,box-shadow] [--v-fill:var(--v-color-text-link)] hover:shadow"
              >
                <p className="col-start-1 col-end-2 content-center">
                  <span className="@w640:bg-card @w640:aspect-[4/3] @w640:h-auto @w640:w-full relative grid place-items-center rounded-lg">
                    <span className="@w640:size-8 relative block size-4">
                      {(() => {
                        switch (type) {
                          case 'video':
                            return <SvgIcon name="play" alt={type} />;
                          case 'podcast':
                            return <SvgIcon name="headphone" alt={type} />;
                          default:
                            return <SvgIcon name={type} alt={type} />;
                        }
                      })()}
                    </span>
                  </span>
                </p>
                <p className="@w640:content-center @w640:px-4 @w640:text-center col-start-2 col-end-3 pl-2 font-mono text-xs uppercase leading-[inherit]">
                  {category}
                </p>
                <div className="@w640:col-start-3 @w640:col-end-4 @w640:text-base col-start-1 col-end-3 text-sm leading-[inherit]">
                  <p>
                    <a href={href} id={defaultClickable} className="break-all visited:[--v-color-text-link:#515a9c]">
                      <Title title={title} keyword={keyword} />
                    </a>
                  </p>

                  <p className="align-center mt-1 flex gap-2 text-xs leading-snug">
                    <span>{date}</span>

                    <span className="text-secondary @w640:break-all overflow-hidden text-ellipsis">
                      {href.replace(/#.*/, '')}
                    </span>
                  </p>

                  {tags && tags.length && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        return (
                          <li key={tag}>
                            <span className="bg-tertiary p-1 text-sm dark:bg-gray-700">{tag}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </ClickableArea>
            );
          })}
        </ul>
      </section>
    </>
  );
};
