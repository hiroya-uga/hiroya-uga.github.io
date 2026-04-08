'use client';

import {
  EmojiLinkListItem,
  GAMES_LINK_LIST,
  TOOLS_LINK_LIST,
  TRANSLATION_DOCUMENTS_LINK_LIST,
} from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

const pickUpList = {
  origin: [...TOOLS_LINK_LIST, ...TRANSLATION_DOCUMENTS_LINK_LIST, ...GAMES_LINK_LIST],
  cache: null as EmojiLinkListItem[] | null,
};

const emptyPickUpList = [] as const;

const getPickUpList = () => {
  if (globalThis.window === undefined) {
    return emptyPickUpList;
  }

  // 既にキャッシュがあれば返す
  if (pickUpList.cache) {
    return pickUpList.cache;
  }

  // 初回のみ計算
  pickUpList.cache = pickUpList.origin
    .filter(({ emoji, noPickup }) => Boolean(emoji) && noPickup !== true)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return pickUpList.cache;
};

export const DiscoverSection = () => {
  const pickUpList = useSyncExternalStore(
    () => () => {},
    () => getPickUpList(),
    () => emptyPickUpList,
  );

  return (
    <div className="px-content-inline @w640:py-28 pb-14 pt-11">
      <div className="max-w-content mx-auto">
        <h2 className="mb-11 flex flex-wrap items-center gap-1.5">
          <span className="@w640:text-2xl text-xl font-bold tracking-wide">Discover</span>
          <span className="text-sm text-[#545454] dark:text-[#b3b3b3]">— Random Picks</span>
        </h2>

        <ul
          className={clsx([
            '@w768:grid-cols-3 @w768:gap-8',
            '@w500:gap-y-6',
            'grid gap-y-11 transition-opacity',
            pickUpList.length === 0 && 'min-h-72 opacity-0',
          ])}
        >
          {pickUpList.map(({ emoji, pathname }) => {
            const { pageTitle, description } = getMetadata(pathname);
            const id = String(description) && pathname;

            return (
              <li
                key={pathname}
                className={clsx([
                  '@w768:block',
                  '@w500:grid @w500:grid-cols-[8.5rem_1fr] @w500:grid-rows-[auto_1fr] gap-x-3 gap-y-1',
                ])}
              >
                <p
                  className={clsx([
                    '@w768:block @w768:mb-1',
                    '@w500:grid @w500:grid-cols-subgrid @w500:grid-rows-subgrid @w500:col-start-1 @w500:-col-end-1 @w500:row-start-1 @w500:-row-end-1 @w500:mb-0',
                    'mb-1',
                  ])}
                >
                  <Link
                    href={pathname}
                    className={clsx([
                      '@w768:flex',
                      '@w500:grid @w500:grid-cols-subgrid @w500:grid-rows-subgrid @w500:col-start-1 @w500:-col-end-1 @w500:row-start-1 @w500:-row-end-1',
                      'group flex flex-col-reverse rounded-md no-underline',
                    ])}
                    aria-describedby={id}
                  >
                    <span
                      className={clsx([
                        '@w500:col-start-2 @w500:pt-0.5 @w500:col-end-3 @w500:row-start-1 @w500:row-end-2',
                        'inline-block leading-normal underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current',
                      ])}
                    >
                      {pageTitle}
                    </span>
                    <span
                      className={clsx([
                        '@w768:aspect-[1.618/1] @w768:p-0 @w768:mb-1.5',
                        '@w500:col-start-1 @w500:col-end-2 @w500:row-start-1 @w500:row-end-3 @w500:mb-0 @w500:aspect-square',
                        'bg-card font-emoji mb-2 grid place-content-center overflow-hidden rounded-md p-10 text-[3.5rem] leading-none',
                      ])}
                      aria-hidden="true"
                    >
                      <span className="backface-hidden rotate-[0.1deg] scale-[0.85] transition-transform duration-300 group-hover:scale-100">
                        {emoji}
                      </span>
                    </span>
                  </Link>
                </p>
                {description && (
                  <p
                    className={clsx(['@w500:col-start-2 @w500:col-end-3 @w500:row-start-2 @w500:row-end-3', 'text-sm'])}
                    id={id}
                  >
                    {description}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
