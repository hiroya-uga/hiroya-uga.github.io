'use client';

import React, { useEffect, useState } from 'react';

import { marked } from 'marked';

const NestedList = ({ headingList }: { headingList: HTMLHeadingElement[] }) => {
  const src: string[] = [];

  headingList.forEach((heading) => {
    const innerHTML = (heading.querySelector('strong') ?? heading).innerHTML ?? '';
    const { id } = heading;
    const [indexText, ...textContent] = innerHTML.split(/\s/);
    const depth = indexText.match(/\./g)?.length ?? 0;
    const indent = ''.padStart(depth * 2, ' ');

    src.push(`${indent}- [<span>${indexText}</span><span>${textContent.join(' ')}</span>](#${id})`);
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(src.join('\n')),
      }}
    />
  );
};

export const Toc = () => {
  const [headingList, setHeadingList] = useState<HTMLHeadingElement[]>([]);

  useEffect(() => {
    setHeadingList(
      [...document.querySelectorAll<HTMLHeadingElement>('h2, h3, h4, h5, h6')].filter(({ textContent }) => {
        return /^[0-9]/.test(textContent ?? '');
      }),
    );
  }, []);

  if (headingList.length === 0) {
    return <></>;
  }

  return (
    <>
      <h2>Table of Contents</h2>

      <div id="toc">
        <NestedList headingList={headingList} />
      </div>
    </>
  );
};
