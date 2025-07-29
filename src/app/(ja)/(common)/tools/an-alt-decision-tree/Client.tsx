'use client';

import { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AnAltDecisionTreeAnswer } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/AnAltDecisionTreeAnswer';
import { AnAltDecisionTreeException } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/AnAltDecisionTreeException';
import { AnAltDecisionTreeQuestion } from '@/app/(ja)/(common)/tools/an-alt-decision-tree/AnAltDecisionTreeQuestion';

import styles from '@/app/(ja)/(common)/tools/an-alt-decision-tree/Client.module.css';
import { RunButton } from '@/components/Clickable';

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
    <p className="mt-28 text-right">
      <RunButton
        type="button"
        onClick={() => {
          setPageState({
            index: 0,
            isCurrent: false,
          });
        }}
      >
        やり直す
      </RunButton>
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

        <div className="border-primary mt-12 border-t pt-10">
          <ul className="@w640:grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)] mx-auto grid w-fit justify-center gap-4">
            <li>
              <RunButton
                type="button"
                onClick={() => {
                  setPageState({
                    index,
                    isCurrent: true,
                  });
                }}
              >
                はい
              </RunButton>
            </li>
            <li>
              <RunButton
                type="button"
                onClick={() => {
                  setPageState({
                    index: index + 1,
                    isCurrent: false,
                  });
                }}
              >
                いいえ
              </RunButton>
            </li>
          </ul>
        </div>
      </div>

      {index !== 0 && (
        <p className="mr-auto mt-10 w-fit">
          <RunButton
            type="button"
            onClick={() => {
              router.back();
            }}
            beforeIcon="arrow-left"
          >
            戻る
          </RunButton>
        </p>
      )}
    </>
  );

  return <Container />;
};
