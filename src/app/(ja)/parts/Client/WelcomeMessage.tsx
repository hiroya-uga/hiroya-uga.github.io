'use client';

import { SITE_NAME } from '@/constants/meta';
import { arrayShuffle } from '@/utils/array-shuffle';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

const COUNTER_LENGTH = 6;
const { window } = globalThis;
const message = [
  {
    mapping: [
      ['繧', 'よ'],
      ['医≧', 'う'],
      ['縺', 'こ'],
      ['薙◎', 'そ'],
      [` ${SITE_NAME} `, ` ${SITE_NAME} `],
      ['縺ｸ', 'へ'],
      ['縲�', '。'],
    ],
  },
  {
    mapping: [
      ['縺', 'あ'],
      ['ゅ', 'な'],
      ['↑', 'た'],
      ['溘�', 'は'],
    ],
  },
  {
    mapping: [
      ['逡ｪ', '番'],
      ['逶ｮ', '目'],
      ['縺ｮ剰', 'の'],
      ['險ｪ°', '訪'],
      ['蝠�', '問'],
      ['繧ゅ', '者'],
      ['＠繧', 'か'],
      ['後', 'も'],
      ['∪', 'し'],
      ['縺', 'れ'],
      ['帙', 'ま'],
      ['ｓ', 'せ'],
      ['縲', 'ん'],
      ['�', '。'],
    ],
  },
];

const getRandomIndexArray = (length: number) => {
  const digits = Array.from({ length }, (_, i) => i);
  return arrayShuffle(digits);
};

export const WelcomeMessage = () => {
  const message1Ref = useRef<HTMLSpanElement>(null);
  const message2Ref = useRef<HTMLSpanElement>(null);
  const message3Ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'already'>('loading');
  const isInitialized = useRef(false);

  const shuffleCounter = useCallback((isAlready = false) => {
    let i = 0;
    let loop = 0;
    let indexArray = getRandomIndexArray(COUNTER_LENGTH);

    const getValue = () => {
      const value = [...String(Math.floor(Math.random() * (Number('1'.padEnd(COUNTER_LENGTH + 1, '0')) - 0 + 1)) + 0)];

      if (loop !== 1) {
        value[indexArray[0]] = indexArray[0] % 2 ? '縺' : '繝';
        value[indexArray[1]] = indexArray[1] % 2 ? '繧' : '縲';
        value[indexArray[2]] = indexArray[2] % 2 ? 'ｳ?' : 'ｶﾞ';
        value[indexArray[3]] = indexArray[3] % 2 ? '�' : '%';
      }

      return value.join('');
    };

    const counterTarget = counterRef.current;
    if (!counterTarget) {
      return;
    }

    let setIntervalId = -1;

    setTimeout(
      () => {
        let prev = ''.padStart(COUNTER_LENGTH, '0');
        let next = getValue().padStart(COUNTER_LENGTH, '0').replaceAll('0', '1');
        const value = [...prev];
        setIntervalId = window.setInterval(() => {
          if (i < COUNTER_LENGTH) {
            value[indexArray[i]] = next[indexArray[i]];
            counterTarget.textContent = value.join('');
            i++;
          } else {
            if (loop < 2) {
              prev = next;
              indexArray = getRandomIndexArray(COUNTER_LENGTH);
              next = getValue().padStart(COUNTER_LENGTH, '0');

              value[indexArray[0]] = next[indexArray[0]];
              counterTarget.textContent = value.join('');
              i = 1;
              loop++;
              return;
            }

            clearInterval(setIntervalId);
          }
        }, 60);
      },
      isAlready ? 0 : 1000,
    );

    return () => {
      clearInterval(setIntervalId);
    };
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const isViewed = getSessionStorage('welcome-message-viewed') === 'true';

    shuffleCounter(isViewed);

    if (isViewed) {
      setStatus('already');
      return;
    }

    setStatus('ready');
    setSessionStorage('welcome-message-viewed', 'true');
  }, [shuffleCounter]);

  // その他の文字
  useEffect(() => {
    const message1 = message1Ref.current;
    const message2 = message2Ref.current;
    const message3 = message3Ref.current;

    if (!message1 || !message2 || !message3 || status !== 'ready') {
      return;
    }

    const nodeList = [message1, message2, message3];
    const characterList = message.map((item, index) => {
      return item.mapping.map((_, index2) => ({ messageIndex: index, wordIndex: index2, done: false }));
    });
    const flatCharacterList = characterList.flat();
    const mapping = getRandomIndexArray(flatCharacterList.length);

    let index = 0;
    let setTimeoutId = -1;
    const updateCharacter = () => {
      const { messageIndex, wordIndex } = flatCharacterList[mapping[index]];

      characterList[messageIndex][wordIndex].done = true;

      nodeList.forEach((node, i) => {
        node.textContent = characterList[i]
          .map((item) => {
            if (item.done) {
              return message[i].mapping[item.wordIndex][1];
            }
            return message[i].mapping[item.wordIndex][0];
          })
          .join('');
      });

      index++;

      if (index < flatCharacterList.length) {
        setTimeoutId = window.setTimeout(updateCharacter, Math.random() * 100 + 30);
        return;
      }

      clearTimeout(setTimeoutId);
    };

    setTimeout(() => {
      updateCharacter();
    }, 1000);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [status]);

  return (
    <p
      className={clsx([
        // 14 * 1.875 = 26.25px
        // 26 * 3 = 78px (3lh)
        // 78px + 1px = 79px (for iOS Safari)
        'leading-26px min-h-79px text-center text-sm transition-opacity',
        status === 'loading' ? 'opacity-0' : 'opacity-100',
      ])}
    >
      <span ref={message1Ref} aria-hidden="true">
        {message[0].mapping.map(([a, b]) => (status === 'already' ? b : a))}
      </span>
      <span className="@w640:inline block">
        <span ref={message2Ref} aria-hidden="true">
          {message[1].mapping.map(([a, b]) => (status === 'already' ? b : a)).join('')}
        </span>
        <span className="sr-only select-none">{`${message[0].mapping.map(([_, c]) => c).join('')}${message[1].mapping.map(([_, c]) => c).join('')}`}</span>
        <span className="mx-1 font-mono" ref={counterRef}>
          {''.padStart(COUNTER_LENGTH, '0')}
        </span>
        <span className="sr-only select-none">{message[2].mapping.map(([_, c]) => c).join('')}</span>
        <span ref={message3Ref} aria-hidden="true">
          {message[2].mapping.map(([a, b]) => (status === 'already' ? b : a))}
        </span>
      </span>
    </p>
  );
};
