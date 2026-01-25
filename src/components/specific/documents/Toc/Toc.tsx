'use client';

import styles from '@/app/(en)/(specs)/layout.module.css';
import { useEffect, useSyncExternalStore } from 'react';

import { marked } from 'marked';

import { DISALLOWED_ID_CHARACTERS_REGEX } from '@/constants/regexp';

const NestedList = ({ headingList, numberingOnly }: { headingList: HTMLHeadingElement[]; numberingOnly?: boolean }) => {
  const src: string[] = [];

  headingList.forEach((heading) => {
    if (numberingOnly) {
      const innerHTML = (heading.querySelector('strong') ?? heading).innerHTML ?? '';
      const { id } = heading;
      const [indexText, ...textContent] = innerHTML.split(/\s/);
      const depth = indexText.match(/\./g)?.length ?? 0;
      const indent = ''.padStart(depth * 4 - 4, ' ');

      src.push(
        `${indent}- [<span>${indexText}</span><span>${textContent.join(' ')}</span>](#${id.replace(DISALLOWED_ID_CHARACTERS_REGEX, '')})`,
      );
    } else {
      const textContent = (heading.querySelector('strong') ?? heading).textContent ?? '';
      const id = heading.id ?? heading.textContent;
      const depth = (parseInt(heading.tagName.slice(1), 10) || 1) - 1;
      const indent = ''.padStart(depth * 2, ' ');

      src.push(`${indent}- [${textContent}](#${id.replace(DISALLOWED_ID_CHARACTERS_REGEX, '')})`);
    }
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(src.join('\n')),
      }}
    />
  );
};

// サーバー側のスナップショットをキャッシュ（参照の安定性を保つ）
const emptyHeadingList: HTMLHeadingElement[] = [];

// クライアント側のスナップショットをキャッシュ
let cachedHeadingList: HTMLHeadingElement[] | null = null;
let cachedNumberingOnly: boolean | undefined = undefined;

const getHeadingList = (numberingOnly?: boolean) => {
  if (typeof document === 'undefined') {
    return emptyHeadingList;
  }

  const headings = [...document.querySelectorAll<HTMLHeadingElement>(':is(h2, h3, h4, h5, h6):where(main *)')].filter(
    ({ textContent }) => {
      if (numberingOnly) {
        return /^\d/.test(textContent ?? '');
      }
      return true;
    },
  );

  // 同じ結果なら前回のキャッシュを返す（参照の安定性）
  if (
    cachedHeadingList &&
    cachedNumberingOnly === numberingOnly &&
    cachedHeadingList.length === headings.length &&
    cachedHeadingList.every((h, i) => h === headings[i])
  ) {
    return cachedHeadingList;
  }

  cachedHeadingList = headings;
  cachedNumberingOnly = numberingOnly;
  return headings;
};

export const Toc = ({
  title = 'Table of Contents',
  numberingOnly,
  onready,
}: {
  title?: string;
  numberingOnly?: boolean;
  onready?: () => void;
}) => {
  const headingList = useSyncExternalStore(
    () => () => {},
    () => getHeadingList(numberingOnly),
    () => emptyHeadingList,
  );

  useEffect(() => {
    if (headingList.length > 0) {
      onready?.();
    }
  }, [headingList, onready]);

  if (headingList.length === 0) {
    return <></>;
  }

  return (
    <>
      <h2 className="p-0! m-0! text-base!">{title}</h2>

      <div id={styles.toc}>
        <NestedList headingList={headingList} numberingOnly={numberingOnly} />
      </div>
    </>
  );
};
