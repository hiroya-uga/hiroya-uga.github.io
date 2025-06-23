'use client';

import React, { SetStateAction, useId, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Details } from '@/components/Box';
import { ClearButton } from '@/components/Clickable';
import { ClickableArea } from '@/components/Clickable/ClickableArea';
import { ArticleIcon, BookIcon, HeadphoneIcon, PlayIcon } from '@/components/Icons';
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
          <div className="p-6 pb-8 sm:p-8 sm:pb-9 sm:pt-7">
            <div className="mb-6 flex flex-row-reverse sm:mb-10">
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

            <fieldset className="mb-6 sm:mb-10">
              <legend className="mb-3 font-bold">Categories</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaCategory} stateSet={categoriesStatus} dispatch={setCategoriesStatus} />
              </ul>
            </fieldset>

            <fieldset className="mb-6 sm:mb-10">
              <legend className="mb-3 font-bold">Tags</legend>
              <ul className="flex flex-wrap gap-2 pl-4">
                <CheckBoxes nameSet={mediaTags} stateSet={tagsStatus} dispatch={setTagsStatus} />
              </ul>
            </fieldset>

            <p className="flex pr-2">
              <label htmlFor={idForKeywords} className="mr-2 font-bold">
                <span className="block py-2 pr-2">Keywords</span>
              </label>
              <span className="grow">
                <input
                  id={idForKeywords}
                  className="w-full rounded border border-slate-400 p-2"
                  value={keyword}
                  onChange={({ currentTarget }) => {
                    setKeyword(currentTarget.value);

                    router.replace(`${pathname ?? window.location.pathname}?query=${currentTarget.value}`, {
                      scroll: false,
                    });
                  }}
                />
              </span>
            </p>
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

        <ul className="mb-2 sm:space-y-4 space-y-6">
          {result.map(({ type, date, category, title, href, tags }) => {
            const defaultClickable = createId(id, href);
            return (
              <ClickableArea
                key={href}
                as="li"
                defaultClickable={defaultClickable}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[6.25rem_auto_1fr] leading-6 sm:leading-7 p-2 sm:p-4 rounded-lg hover:bg-white transition-[background-color,box-shadow] hover:shadow"
              >
                <p className="col-start-1 col-end-2 content-center">
                  <span className="relative  sm:w-full sm:bg-card sm:h-auto rounded-lg grid place-items-center sm:aspect-[4/3]">
                    <span className="block relative size-4 sm:size-8 [--v-fill:var(--v-color-text-link)]">
                      {(() => {
                        switch (type) {
                          case 'video':
                            return <PlayIcon alt={type} />;
                          case 'podcast':
                            return <HeadphoneIcon alt={type} />;
                          case 'article':
                            return <ArticleIcon alt={type} />;
                          case 'book':
                            return <BookIcon alt={type} />;
                        }
                      })()}
                    </span>
                  </span>
                </p>
                <p className="col-start-2 col-end-3  pl-2 font-mono text-xs uppercase leading-[inherit] sm:px-4 sm:content-center sm:text-center">
                  {category}
                </p>
                <div className="col-start-1 col-end-3 sm:col-start-3 sm:col-end-4 text-sm leading-[inherit] sm:text-base">
                  <p>
                    <a href={href} id={defaultClickable} className="break-all visited:[--v-color-text-link:#515a9c]">
                      <Title title={title} keyword={keyword} />
                    </a>
                  </p>

                  <p className="mt-1 flex gap-2 text-xs align-center leading-snug">
                    <span>{date}</span>

                    <span className="overflow-hidden text-ellipsis text-secondary sm:break-all">
                      {href.replace(/#.*/, '')}
                    </span>
                  </p>

                  {tags && tags.length && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        return (
                          <li key={tag}>
                            <span className="bg-slate-200 p-1">{tag}</span>
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
