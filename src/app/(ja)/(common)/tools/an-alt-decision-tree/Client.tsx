'use client';

import styles from '@/app/(ja)/(common)/tools/an-alt-decision-tree/Client.module.css';
import {
  AnAltDecisionTreeAnswer,
  AnAltDecisionTreeException,
  AnAltDecisionTreeQuestion,
} from '@/components/specific/tools/an-alt-decision-tree';

import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import 'highlight.js/styles/github-dark.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const formatIndex = (value: string | number | undefined | null) => {
  const index = typeof value !== 'number' ? Number(value) : value;

  if (isNaN(index)) {
    return 0;
  }

  if (index < 1) {
    return 0;
  }

  return index - 1;
};

const ResetButton = ({ setPageState }: { setPageState: (_: { index: number; isCurrent: boolean }) => void }) => {
  return (
    <p className="mt-12 text-right">
      <button
        type="button"
        className="px-2 py-1 bg-slate-100"
        onClick={() => {
          setPageState({
            index: 0,
            isCurrent: false,
          });
        }}
      >
        やり直す
      </button>
    </p>
  );
};

export const AnAltDecisionTreeContent = () => {
  const searchParams = useSearchParams();
  const [index, setIndex] = useState(formatIndex(searchParams?.get('q')));
  const [isCurrent, setIsCorrect] = useState(searchParams?.get('current') === '1');
  const pathname = usePathname();
  const router = useRouter();
  const setPageState = useCallback(
    (options: { index: number; isCurrent: boolean }) => {
      const query = new URLSearchParams();

      if (options.index) {
        query.set('q', String(options.index + 1));
      }

      if (options.isCurrent) {
        query.set('current', '1');
      }

      router.push(`${pathname ?? window.location.pathname}?${query.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  useEffect(() => {
    const indexParam = formatIndex(searchParams?.get('q'));
    const currentParam = searchParams?.get('current') === '1';

    if (indexParam !== index) {
      setIndex(indexParam);
    }

    if (currentParam !== isCurrent) {
      setIsCorrect(currentParam);
    }
  }, [index, isCurrent, searchParams]);

  if (3 < index) {
    return (
      <div className={styles.throw}>
        <AnAltDecisionTreeException />
        <ResetButton setPageState={setPageState} />
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div className={styles.goal}>
        <AnAltDecisionTreeAnswer index={index} />
        <ResetButton setPageState={setPageState} />
      </div>
    );
  }

  const Container = () => (
    <>
      <div className={clsx([`${styles.slide}`, index === 0 && 'pb-4'])}>
        <AnAltDecisionTreeQuestion index={index} />

        <ul className="mt-12 pt-10 border-t border-t-slate-200 flex justify-center gap-4 flex-wrap">
          <li>
            <button
              type="button"
              className="p-4 border border-solid border-black bg-white  rounded min-w-[7rem]"
              onClick={() => {
                setPageState({
                  index,
                  isCurrent: true,
                });
              }}
            >
              はい
            </button>
          </li>
          <li>
            <button
              type="button"
              className="p-4 border border-solid border-black bg-white rounded min-w-[7rem]"
              onClick={() => {
                setPageState({
                  index: index + 1,
                  isCurrent: false,
                });
              }}
            >
              いいえ
            </button>
          </li>
        </ul>
      </div>

      {index !== 0 && (
        <p className="mt-10">
          <button
            type="button"
            className="px-2 py-1 bg-slate-100"
            onClick={() => {
              router.back();
            }}
          >
            戻る
          </button>
        </p>
      )}
    </>
  );

  return (
    <>
      <Container />
    </>
  );
};
