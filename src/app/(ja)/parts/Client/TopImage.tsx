'use client';

import { Picture } from '@/components/Image';
import clsx from 'clsx';
import { useCallback, useState } from 'react';

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
    caption: '富士見橋(東京都)',
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

    setIsFirstRender(false);
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

  const transitionClassName = [
    'transition-[opacity,visibility] duration-300',
    isLoading ? 'opacity-0' : 'opacity-100',
    isLoading ? 'invisible' : 'visible',
  ];

  if (isFirstRender) {
    updateImage();
  }

  return (
    <div
      className="@content:rounded-lg group relative overflow-hidden"
      tabIndex={-1}
      onClick={(e) => void e.currentTarget.focus()}
    >
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
                fetchPriority="high"
                priority
              />
            ))}
        </div>

        <figcaption className="text-2xs @w640:text-sm text-white">
          <span className="absolute left-0 top-0 z-10 flex w-full -translate-y-full flex-row-reverse items-center bg-[#00000080] py-2 pl-4 pr-2 text-white transition-transform group-focus-within:translate-y-0 group-hover:translate-y-0">
            <span className="@w640:w-56 w-40 text-right">
              <a
                href={photoData?.href || 'https://www.instagram.com/hiroya.uga/'}
                className="transition-bg bg-secondary text-primary z-10 inline-block cursor-pointer rounded-full border border-[#00000080] px-3 py-1 leading-tight no-underline hover:bg-gray-200"
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
          className="group/reload @w640:top-2 @w640:size-8 @w640:p-0 absolute inset-0 size-full rounded-full border border-[#00000080] p-1"
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
  );
};
