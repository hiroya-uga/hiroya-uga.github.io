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

export const PickUpList = () => {
  const pickUpList = useSyncExternalStore(
    () => () => {},
    () => getPickUpList(),
    () => emptyPickUpList,
  );

  return (
    <ul
      className={clsx([
        '@w640:grid-cols-3 @w768:gap-8 grid gap-4 transition-opacity',
        pickUpList.length === 0 && 'min-h-72 opacity-0',
      ])}
    >
      {pickUpList.map(({ emoji, pathname }) => {
        const { pageTitle, description } = getMetadata(pathname);
        const id = String(description) && pathname;

        return (
          <li key={pathname}>
            <p className="mb-1">
              <Link
                href={pathname}
                className="group flex flex-col-reverse rounded-md no-underline"
                aria-describedby={id}
              >
                <span className="inline-block leading-normal group-hover:underline">
                  {pageTitle}
                  {/* {item.isWip && <b>（WIP）</b>} */}
                </span>
                <span
                  className="bg-card font-emoji @w640:aspect-[1.618/1] @w640:p-0 mb-3 grid place-content-center overflow-hidden rounded-md p-10 text-[3.5rem] leading-none"
                  aria-hidden="true"
                >
                  <span className="backface-hidden rotate-[0.1deg] scale-[0.85] transition-transform duration-300 group-hover:scale-100">
                    {emoji}
                  </span>
                </span>
              </Link>
            </p>
            {description && (
              <p className="text-xs" id={id}>
                {description}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};
