'use client';

import { LoadingIcon } from '@/components/Icons';
import { Picture } from '@/components/Image';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';

type PhotoData = {
  caption: string;
  spec: string;
  instagram: string;
  date: string;
} & (
  | {
      src: string;
    }
  | {
      error: string;
    }
);

const photoDataList: PhotoData[] = [
  {
    src: '/main-hyotan-onsen.webp',
    caption: 'ひょうたん温泉 第2駐車場前',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVLf204D0J0',
    date: '2024.12.14',
  },
  {
    src: '/main-kiryucoco.webp',
    caption: '東京ドームシティ',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVGzOthD2Py',
    date: '2023.09.03',
  },
  {
    src: '/main-tsutsujigaoka.webp',
    caption: '京王線 つつじヶ丘駅',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'DVEL5h3j25D',
    date: '2023.12.17',
  },
  {
    src: '/main-keishoan.webp',
    caption: '円覚寺 桂昌庵',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'Cm9kBgZPF25',
    date: '2022.06.21',
  },
  {
    src: '/main-kamiisonotorii.webp',
    caption: '神磯の鳥居',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CXIGmx_Bob3',
    date: '2021.12.06',
  },
  {
    src: '/main-yamanakako.webp',
    caption: '山中湖 花の都公園',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE9XGAEHfS9',
    date: '2020.08.22',
  },
  {
    src: '/main-minokakeiwa.webp',
    caption: '南伊豆 蓑掛岩',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE6INpCn9LC',
    date: '2020.08.16',
  },
  {
    src: '/main-shinjuku.webp',
    caption: 'JR新宿駅 甲州街道改札',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CE6Deb7nUx7',
    date: '2020.07.23',
  },
  {
    src: '/main-akihabara.webp',
    caption: 'JR秋葉原駅',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    instagram: 'CCzs-IZnC7m',
    date: '2020.07.18',
  },
  {
    src: '/main-ushinshiro.webp',
    caption: '牛代 みずめ桜',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B-616CxH8FE',
    date: '2020.04.05',
  },
  {
    src: '/main-sumidaaquarium.webp',
    caption: 'すみだ水族館',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    instagram: 'B65DejRnF0i',
    date: '2020.01.03',
  },
  {
    src: '/main-c97.webp',
    caption: 'コミックマーケット97 Day4',
    spec: 'iPhone XS Max',
    instagram: 'B6u8koWnH_-',
    date: '2019.12.31',
  },
  {
    src: '/main-venusfort.webp',
    caption: 'VenusFort',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    instagram: 'B6qVD7Invry',
    date: '2019.12.28',
  },
  {
    src: '/main-nact.webp',
    caption: '国立新美術館',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B6LKGmvHqff',
    date: '2019.12.17',
  },
  {
    src: '/main-escalator.webp',
    caption: 'リンクスクエア新宿',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    instagram: 'B4d9_CPn9M7',
    date: '2019.11.01',
  },
  {
    src: '/main-fujimibashi.webp',
    caption: '富士見橋(東京都)',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + Nikon D7200',
    instagram: 'B3n_xUcn86N',
    date: '2019.10.13',
  },
];

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

  return <>{lens}</>;
};

const generateRandomArray = () => {
  const indexes = Array.from({ length: photoDataList.length }, (_, i) => i);

  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  return indexes.map((index) => photoDataList[index]);
};

const TRANSITION_DURATION = 350;

export const TopImage = ({ captionId }: { captionId: string }) => {
  const [shouldShowImage, setShouldShowImage] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoData | null>(null);

  const isMountedRef = useRef(true);
  const isImageLoadingRef = useRef(false);
  const photoDataListRef = useRef(generateRandomArray());
  const currentIndexRef = useRef(-1);
  const setTimeoutId = useRef(-1);

  const updateImage = useCallback(() => {
    if (isImageLoadingRef.current) {
      return;
    }

    isImageLoadingRef.current = true;
    currentIndexRef.current++;

    if (photoDataListRef.current.length <= currentIndexRef.current) {
      photoDataListRef.current = generateRandomArray();
      currentIndexRef.current = 0;
    }

    setShouldShowImage(false);

    setTimeoutId.current = window.setTimeout(() => {
      const currentItem = photoDataListRef.current[currentIndexRef.current];

      if ('src' in currentItem === false) {
        return;
      }

      setPhotoData(currentItem);
    }, TRANSITION_DURATION);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    queueMicrotask(() => {
      updateImage();
    });

    return () => {
      isMountedRef.current = false;
      isImageLoadingRef.current = false;
      clearTimeout(setTimeoutId.current);
    };
  }, [updateImage]);

  const show = () => {
    isImageLoadingRef.current = false;
    setShouldShowImage(true);
  };

  return (
    <div
      role="group"
      aria-label="トップ画像"
      className="@content:rounded-lg group relative overflow-hidden"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target instanceof HTMLAnchorElement || e.target instanceof HTMLButtonElement) {
          return;
        }

        e.currentTarget.focus();
      }}
    >
      <figure className="min-h bg-primary relative" aria-live="polite">
        <p className="aspect-3/2 isolate">
          {photoData && 'src' in photoData && (
            <Picture
              width={960}
              height={640}
              src={photoData.src}
              alt=""
              className={clsx([
                'z-1 relative block size-full object-cover',
                'starting:opacity-0 starting:invisible transition-fade duration-300',
                shouldShowImage ? 'opacity-100' : 'opacity-0',
                shouldShowImage ? 'visible' : 'invisible',
              ])}
              aria-describedby={captionId}
              fetchPriority="high"
              priority
              onLoad={() => {
                if (isMountedRef.current === false) {
                  return;
                }
                show();
              }}
              onError={() => {
                if (isMountedRef.current === false) {
                  return;
                }
                const date = new Date();
                setPhotoData({
                  error: '404 NOT FOUND',
                  instagram: '',
                  caption: 'UNKNOWN',
                  spec: 'NO DATA',
                  date: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`,
                });
                show();
              }}
            />
          )}

          {photoData && 'error' in photoData && (
            <span
              className={clsx([
                'text-middle absolute grid size-full place-items-center text-center',
                shouldShowImage ? 'text-inherit' : 'text-transparent',
              ])}
            >
              {photoData.error}
            </span>
          )}

          {(photoData === null || 'error' in photoData === false) && (
            <span className="absolute inset-0 z-0 grid size-full place-items-center">
              <LoadingIcon alt="" />
            </span>
          )}
        </p>

        <figcaption className="text-white [--v-text-shadow:0_2px_14px_rgba(0,0,0,.9)]">
          <span
            className={clsx([
              '@w640:pl-4 @w640:pr-3 @w640:pb-10 @w640:bg-transparent @w640:bg-[linear-gradient(to_bottom,rgba(0,0,0,.45),rgba(0,0,0,.2),transparent)]',
              'absolute left-0 top-0 z-10 flex w-full -translate-y-full flex-row-reverse items-center bg-[#00000080] px-2 py-2 text-white transition-transform group-focus-within:translate-y-0 group-hover:translate-y-0',
            ])}
          >
            <span>
              <a
                href={
                  typeof photoData?.instagram === 'string'
                    ? `https://www.instagram.com/p/${photoData.instagram}/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==`
                    : 'https://www.instagram.com/hiroya.uga/'
                }
                className="transition-bg bg-panel-primary text-primary hover:bg-panel-primary-hover border-primary text-2xs @w640:text-sm z-10 block w-fit cursor-pointer rounded-full border px-3 py-1 leading-tight no-underline"
              >
                Instagramで見る
              </a>
            </span>
            <span
              className={clsx([
                '@w800:text-base @w640:text-sm grow truncate text-xs leading-tight transition-[color,text-shadow]',
                shouldShowImage ? 'text-shadow-(--v-text-shadow) text-inherit' : 'text-transparent',
              ])}
            >
              {photoData?.caption}
              <span className="text-2xs @w800:text-sm @w640:text-xs ml-1 inline-block"> at {photoData?.date}</span>
            </span>
          </span>
          <span
            className="palt @w640:min-h-17 @w640:pr-64px pr-48px @w640:pl-4 @w640:bg-transparent @w640:pt-5 @w640:bg-[linear-gradient(to_top,rgba(0,0,0,.45),rgba(0,0,0,.2),transparent)] absolute bottom-0 right-0 flex min-h-8 w-full translate-y-full items-center justify-end bg-[#00000080] pl-2 leading-tight text-white transition-transform group-focus-within:translate-y-0 group-hover:translate-y-0"
            id={captionId}
          >
            <span
              className={clsx([
                '@w800:font-thin @w800:text-base text-2xs @w640:text-sm truncate font-light transition-[color,text-shadow]',
                shouldShowImage ? 'text-shadow-(--v-text-shadow) text-inherit' : 'text-transparent',
              ])}
            >
              <Spec spec={photoData?.spec ?? 'loading...'} />
            </span>
          </span>
        </figcaption>
      </figure>

      <p
        className={clsx([
          '@w640:h-12 @w640:py-2 @w640:right-4',
          'absolute bottom-0 right-2 z-10 size-8 translate-y-full focus-within:translate-y-0 group-focus-within:translate-y-0 group-hover:translate-y-0',
          'transition-[opacity,visibility,translate]',
        ])}
      >
        <button
          type="button"
          className="@w640:top-2 @w640:size-8 @w640:p-0 size-32px absolute inset-0 rounded-full p-1"
          onClick={updateImage}
        >
          <span className="border-primary bg-panel-primary hover:bg-panel-primary-hover transition-bg grid size-full place-items-center rounded-full border outline-offset-2">
            <svg
              version="1.1"
              role="img"
              aria-label="ランダムに切り替える"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
              className="@w640:size-5 block size-4"
            >
              <g>
                <path
                  d="M403.925,108.102c-27.595-27.595-62.899-47.558-102.459-56.29L304.182,0L201.946,53.867l-27.306,14.454
		l-5.066,2.654l8.076,4.331l38.16,20.542l81.029,43.602l2.277-42.859c28.265,7.546,53.438,22.53,73.623,42.638
		c29.94,29.939,48.358,71.119,48.358,116.776c0,23.407-4.843,45.58-13.575,65.687l40.37,17.532
		c11.076-25.463,17.242-53.637,17.242-83.219C465.212,198.306,441.727,145.904,403.925,108.102z"
                  style={{ fill: 'var(--color-primary)' }}
                ></path>
                <path
                  d="M296.256,416.151l-81.101-43.612l-2.272,42.869c-28.26-7.555-53.51-22.53-73.618-42.636
		c-29.945-29.95-48.364-71.12-48.364-116.767c0-23.427,4.844-45.522,13.576-65.697l-40.37-17.531
		c-11.076,25.53-17.242,53.723-17.242,83.228c0,57.679,23.407,110.157,61.21,147.893c27.595,27.594,62.899,47.548,102.453,56.202
		l-2.716,51.9l102.169-53.878l27.455-14.454l4.988-2.643l-7.999-4.332L296.256,416.151z"
                  style={{ fill: 'var(--color-primary)' }}
                ></path>
              </g>
            </svg>
          </span>
        </button>
      </p>
    </div>
  );
};
