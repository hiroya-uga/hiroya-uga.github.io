'use client';
import { GAMES_LINK_LIST, TOOLS_LINK_LIST, TRANSLATION_DOCUMENTS_LINK_LIST } from '@/constants/link-list';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Picture } from '@/components/Image';
import { SITE_NAME } from '@/constants/meta';
import { arrayShuffle } from '@/utils/array-shuffle';
import { getMetadata } from '@/utils/get-metadata';
import { getSessionStorage, setSessionStorage } from '@/utils/session-storage';
import clsx from 'clsx';
import Link from 'next/link';

const COUNTER_LENGTH = 6;
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
      ['蝠�', '問'],
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
        let value = [...prev];
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

const photoDataList = [
  {
    src: '/main-keishoan.webp',
    caption: '円覚寺 桂昌庵',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/Cm9kBgZPF25/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2022.06.21',
  },
  {
    src: '/main-kamiisonotorii.webp',
    caption: '神磯の鳥居',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CXIGmx_Bob3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2021.12.06',
  },
  {
    src: '/main-yamanakako.webp',
    caption: '山中湖 花の都公園',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE9XGAEHfS9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.08.22',
  },
  {
    src: '/main-minokakeiwa.webp',
    caption: '南伊豆 蓑掛岩',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE6INpCn9LC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.08.16',
  },
  {
    src: '/main-shinjuku.webp',
    caption: 'JR新宿駅 甲州街道改札',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE6Deb7nUx7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.07.23',
  },
  {
    src: '/main-akihabara.webp',
    caption: 'JR秋葉原駅',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'hhttps://www.instagram.com/p/CCzs-IZnC7m/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.07.18',
  },
  {
    src: '/main-ushinshiro.webp',
    caption: '牛代 みずめ桜',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B-616CxH8FE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.04.05',
  },
  {
    src: '/main-sumidaaquarium.webp',
    caption: 'すみだ水族館',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B65DejRnF0i/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.01.03',
  },
  {
    src: '/main-c97.webp',
    caption: 'コミックマーケット97 Day4',
    spec: 'iPhone XS Max',
    href: 'https://www.instagram.com/p/B6u8koWnH_-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.12.31',
  },
  {
    src: '/main-venusfort.webp',
    caption: 'VenusFort',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B6qVD7Invry/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.12.28',
  },
  {
    src: '/main-nact.webp',
    caption: '国立新美術館',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B6LKGmvHqff/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.12.17',
  },
  {
    src: '/main-escalator.webp',
    caption: 'リンクスクエア新宿',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B4d9_CPn9M7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.11.01',
  },
  {
    src: '/main-fujimibashi.webp',
    caption: '富士見橋（東京都）',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + Nikon D7200',
    href: 'https://www.instagram.com/p/B3n_xUcn86N/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.10.13',
  },
];

const loadedImageCache = new Set<string>();

const Spec = ({ spec }: { spec: string }) => {
  if (!spec) {
    return <></>;
  }

  const array = spec.split('+');
  const lens = array.shift()?.trim();
  const other = array.join('+').trim();

  if (lens && other) {
    return (
      <>
        {lens}
        <span className="inline-block"> + {other}</span>
      </>
    );
  }

  return lens;
};

export const TopImage = ({ captionId }: { captionId: string }) => {
  const generateRandomArray = useCallback(() => {
    const indexes = Array.from({ length: photoDataList.length }, (_, i) => i);

    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
    }

    return indexes;
  }, []);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [photoData, setPhotoData] = useState<
    | (typeof photoDataList)[number]
    | {
        error: string;
        href: string;
        caption: string;
        spec: string;
        date: string;
      }
    | null
  >();
  const [index, setIndex] = useState(0);
  const [indexList, setIndexList] = useState(generateRandomArray());

  const updateImage = useCallback(() => {
    if (isLoading) {
      return;
    }

    setIndex(index + 1);
    setIsLoading(true);

    if (typeof indexList[index + 1] === 'undefined') {
      setIndexList(generateRandomArray());
      setIndex(0);
    }

    const currentItem = photoDataList[indexList[index]];
    const onload = () => {
      loadedImageCache.add(currentItem.src);
      setPhotoData(currentItem);
      setIsLoading(false);
    };

    setTimeout(() => {
      if (loadedImageCache.has(currentItem.src)) {
        onload();
        return;
      }

      const image = new window.Image();
      image.onload = onload;
      image.onerror = () => {
        const date = new Date();

        setPhotoData({
          error: '404 NOT FOUND',
          href: '',
          caption: 'UNKNOWN',
          spec: 'NO DATA',
          date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
        });
        setIsLoading(false);
      };
      image.src = currentItem.src;
    }, 350);
  }, [generateRandomArray, index, indexList, isLoading]);

  useEffect(() => {
    if (isFirstRender) {
      updateImage();
      setIsFirstRender(false);
    }
  }, [isFirstRender, updateImage]);

  const transitionClassName = [
    'transition-[opacity,visibility] duration-300',
    isLoading ? 'opacity-0' : 'opacity-100',
    isLoading ? 'invisible' : 'visible',
  ];

  return (
    <>
      <div className="@content:rounded-lg group relative overflow-hidden" tabIndex={0}>
        <figure aria-live="polite" className="min-h bg-primary relative">
          <div className={clsx(['aspect-3/2', ...transitionClassName])}>
            {photoData &&
              ('error' in photoData ? (
                <p className="text-middle absolute grid size-full place-items-center text-center">{photoData.error}</p>
              ) : (
                <Picture
                  width={960}
                  height={640}
                  src={photoData.src}
                  alt={`${photoData.caption} ${photoData.date}`}
                  className="block size-full object-cover"
                  aria-describedby={captionId}
                  priority
                />
              ))}
          </div>

          <figcaption className="text-2xs @w640:text-sm text-white">
            <span className="absolute left-0 top-0 z-10 flex w-full -translate-y-full flex-row-reverse items-center bg-[#00000080] py-2 pl-4 pr-2 text-white transition-transform group-focus-within:translate-y-0 group-hover:translate-y-0">
              <span className="@w640:w-56 w-40 text-right">
                <a
                  href={photoData?.href || 'https://www.instagram.com/hiroya.uga/'}
                  className="transition-bg z-10 inline-block cursor-pointer rounded-full bg-white px-3 py-1 leading-tight text-black no-underline hover:bg-gray-200 focus-visible:outline-[white]"
                >
                  Instagramで見る
                </a>
              </span>
              <span className={clsx(['grow leading-tight', ...transitionClassName])}>
                <Spec spec={photoData?.spec ?? 'loading...'} />
              </span>
            </span>
            <span
              className="palt @w640:min-h-12 @w640:text-sm absolute bottom-0 right-0 flex min-h-8 w-full translate-y-full items-center bg-[#00000080] pl-4 pr-[48px] text-xs leading-tight text-white transition-transform group-focus-within:translate-y-0 group-hover:translate-y-0"
              id={captionId}
            >
              <span className={clsx(...transitionClassName)}>
                {photoData?.caption && `${photoData?.caption}`}
                <span className="text-2xs @w640:text-xs ml-1 inline-block"> at {photoData?.date}</span>
              </span>
            </span>
          </figcaption>
        </figure>

        <p
          className={clsx([
            '@w640:h-12 @w640:py-2 absolute bottom-0 right-2 z-10 size-8 translate-y-full focus-within:translate-y-0 group-focus-within:translate-y-0 group-hover:translate-y-0',
            'transition-[opacity,visibility,translate]',
            isFirstRender && isLoading ? 'opacity-0' : 'opacity-100',
            isFirstRender && isLoading ? 'invisible' : 'visible',
          ])}
        >
          <button
            type="button"
            className="group/reload @w640:top-2 @w640:size-8 @w640:p-0 absolute inset-0 size-full rounded-full p-1"
            onClick={() => updateImage()}
          >
            <span className="block rounded-full bg-white outline-offset-2">
              <Picture
                src="/icon-reload.svg"
                width={48}
                height={48}
                alt="ランダムに切り替える"
                className="block size-full rounded-full border border-white bg-white opacity-80 transition-opacity group-hover/reload:opacity-65"
              />
            </span>
          </button>
        </p>
      </div>
    </>
  );
};

const pickUpListAll = [...TOOLS_LINK_LIST, ...TRANSLATION_DOCUMENTS_LINK_LIST, ...GAMES_LINK_LIST];

export const PickUpList = () => {
  const [pickUpList, setPickUpList] = useState<typeof pickUpListAll>([]);

  useEffect(() => {
    setPickUpList(() => {
      return pickUpListAll
        .filter(({ emoji, noPickup }) => Boolean(emoji) && noPickup !== true)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    });
  }, []);

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
