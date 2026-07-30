'use client';

import { CardWithSymbol } from '@/components/ui/card/CardWithSymbol';
import {
  EmojiLinkListItem,
  GAMES_LINK_LIST,
  TOOLS_LINK_LIST,
  TRANSLATION_DOCUMENTS_LINK_LIST,
} from '@/constants/link-list';
import { getMetadata } from '@/utils/get-metadata';
import clsx from 'clsx';
import { useSyncExternalStore } from 'react';

const pickUpList = {
  origin: [
    ...TOOLS_LINK_LIST.cli,
    ...TOOLS_LINK_LIST.web,
    ...TOOLS_LINK_LIST.playground,
    ...TRANSLATION_DOCUMENTS_LINK_LIST,
    ...GAMES_LINK_LIST,
  ],
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
    <div className="px-content-inline pt-(--x-section-padding-top) pb-(--x-section-padding-bottom)">
      <div className="max-w-content mx-auto">
        <h2 className="flex flex-wrap items-center gap-1.5">
          <span>Discover</span>
          <span className="w640:text-base pt-2 text-sm text-[#545454] dark:text-[#b3b3b3]">— Random Picks</span>
        </h2>

        <ul
          className={clsx([
            'w768:grid-cols-3 w768:gap-8',
            'w640:mt-7',
            'w500:gap-y-6',
            'mt-5 grid gap-y-11 transition-opacity',
            pickUpList.length === 0 && 'min-h-72 opacity-0',
          ])}
        >
          {pickUpList.map(({ emoji, pathname }) => {
            const { pageTitle, description } = getMetadata(pathname);

            return (
              <li key={pathname} className="@container">
                <CardWithSymbol href={pathname} title={pageTitle} symbol={emoji ?? ''} description={description} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
