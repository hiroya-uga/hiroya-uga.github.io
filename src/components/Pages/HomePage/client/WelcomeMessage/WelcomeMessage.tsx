'use client';

import { SITE_NAME } from '@/constants/meta';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { COUNTER_LENGTH } from './constants';
import { getRandomIndexArray, shuffleCounter } from './utils';

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

export const WelcomeMessage = () => {
  const message1Ref = useRef<HTMLSpanElement>(null);
  const message2Ref = useRef<HTMLSpanElement>(null);
  const message3Ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'already'>('loading');
  const isInitialized = useRef(false);

  const [srOnlyAccessCount, setSrOnlyAccessCount] = useState('');

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const counterTarget = counterRef.current;
    if (counterTarget === null) return;

    const isViewed = getSessionStorage('welcome-message-viewed') === 'true';
    const { finallyCount, cleanup } = shuffleCounter({ counterTarget, isViewed });

    setSrOnlyAccessCount(finallyCount);

    if (isViewed) {
      setStatus('already');
      return cleanup;
    }

    setStatus('ready');
    setSessionStorage('welcome-message-viewed', 'true');
    return cleanup;
  }, []);

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
    <div className="px-content-inline">
      <div className="max-w-content mx-auto">
        <p
          className={clsx([
            // 14 * 1.875 = 26.25px
            // 26 * 3 = 78px (3lh)
            // 78px + 1px = 79px (for iOS Safari)
            'leading-26px min-h-79px text-center text-sm transition-opacity',
            status === 'loading' ? 'opacity-0' : 'opacity-100',
          ])}
        >
          <span className="relative">
            <span className="sr-only inset-0">{`ようこそ ${SITE_NAME} へ。`}</span>
            <span ref={message1Ref} aria-hidden="true">
              {message[0].mapping.map(([a, b]) => (status === 'already' ? b : a))}
            </span>
          </span>
          <span className="@w640:inline relative block">
            <span className="sr-only inset-0">{`あなたは${srOnlyAccessCount}番目の訪問者かもしれません。`}</span>

            <span ref={message2Ref} aria-hidden="true">
              {message[1].mapping.map(([a, b]) => (status === 'already' ? b : a)).join('')}
            </span>
            <span ref={counterRef} className="mx-1 font-mono" aria-hidden="true">
              {''.padStart(COUNTER_LENGTH, '0')}
            </span>
            <span ref={message3Ref} aria-hidden="true">
              {message[2].mapping.map(([a, b]) => (status === 'already' ? b : a))}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
};
