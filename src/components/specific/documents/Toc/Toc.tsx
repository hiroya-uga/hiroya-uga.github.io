'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

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

export const Toc = ({
  title = 'Table of Contents',
  numberingOnly,
  setLoaded,
}: {
  title?: string;
  numberingOnly?: boolean;
  setLoaded?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [headingList, setHeadingList] = useState<HTMLHeadingElement[]>([]);

  useEffect(() => {
    setHeadingList(
      [...document.querySelectorAll<HTMLHeadingElement>(':is(h2, h3, h4, h5, h6):where(main *)')].filter(
        ({ textContent }) => {
          if (numberingOnly) {
            return /^[0-9]/.test(textContent ?? '');
          }

          return true;
        },
      ),
    );

    setLoaded?.(true);
  }, [numberingOnly, setLoaded]);

  if (headingList.length === 0) {
    return <></>;
  }

  return (
    <>
      <h2>{title}</h2>

      <div id="toc">
        <NestedList headingList={headingList} numberingOnly={numberingOnly} />
      </div>
    </>
  );
};
