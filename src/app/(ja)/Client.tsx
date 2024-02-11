'use client';

import { useCallback, useEffect, useId, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

export const Counter = ({ count }: { count: string }) => {
  return <span className="font">{count.padStart(6, '0')}</span>;
};

const photoDataList = [
  {
    src: '/main-keishoan.webp',
    width: 512,
    height: 640,
    caption: 'Engakuji Keishoan',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/Cm9kBgZPF25/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2022.06.21',
  },
  {
    src: '/main-kamiisonotorii.webp',
    caption: 'Kamiiso No Torii',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CXIGmx_Bob3/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2021.12.06',
  },
  {
    src: '/main-yamanakako.webp',
    caption: 'Yamanakako Hananomiyako Flower Park',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE9XGAEHfS9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.08.22',
  },
  {
    src: '/main-minokakeiwa.webp',
    caption: 'Minokakeiwa Minamiizu',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE6INpCn9LC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.08.16',
  },
  {
    src: '/main-shinjuku.webp',
    caption: 'JR Shinjuku Station Koshu Kaido Gate',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'https://www.instagram.com/p/CE6Deb7nUx7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.07.23',
  },
  {
    src: '/main-akihabara.webp',
    caption: 'JR Akihabara Station',
    spec: 'NIKKOR Z 24-70mm f/2.8 S + Nikon Z 6',
    href: 'hhttps://www.instagram.com/p/CCzs-IZnC7m/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.07.18',
  },
  {
    src: '/main-ushinshiro.webp',
    caption: 'Mizume Sakura in Ushinshiro',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B-616CxH8FE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.04.05',
  },
  {
    src: '/main-sumidaaquarium.webp',
    caption: 'Sumida Aquarium',
    spec: '17-35mm F/2.8-4 Di OSD (A037) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B65DejRnF0i/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2020.01.03',
  },
  {
    src: '/main-c97.webp',
    caption: 'Comic Market 97 Day4',
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
    caption: 'The National Art Center Tokyo',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B6LKGmvHqff/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.12.17',
  },
  {
    src: '/main-escalator.webp',
    caption: 'LINKSQUARE SHINJUKU',
    spec: 'Tamron SP 24-70mm F/2.8 Di VC USD G2 (A032) + FTZ + Nikon Z 6',
    href: 'https://www.instagram.com/p/B4d9_CPn9M7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    date: '2019.11.01',
  },
  {
    src: '/main-fujimibashi.webp',
    width: 960,
    height: 640,
    caption: 'Fujimi Bashi',
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
        <span className="block md:inline"> + {other}</span>
      </>
    );
  }

  return lens;
};

export const TopImage = () => {
  const captionId = useId();
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

    const currentItem = photoDataList[indexList[index]];

    setIndex(index + 1);
    setIsLoading(true);

    if (typeof indexList[index + 1] === 'undefined') {
      setIndexList(generateRandomArray());
      setIndex(0);
    }

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
    }, 300);
  }, [generateRandomArray, index, indexList, isLoading]);

  useEffect(() => {
    if (isFirstRender) {
      updateImage();
      setIsFirstRender(false);
    }
  }, [isFirstRender, updateImage]);

  const transitionClassName = [
    'transition-[opacity_visibility] duration-300',
    isLoading ? 'opacity-0' : 'opacity-100',
    isLoading ? 'invisible' : 'visible',
  ];

  return (
    <>
      <div className="group relative overflow-hidden" tabIndex={0}>
        <figure aria-live="polite" className={clsx(['relative min-h bg-white'])}>
          <div className={clsx(['aspect-[3_/_2]', ...transitionClassName])}>
            {photoData &&
              ('error' in photoData ? (
                <p className="absolute h-full w-full text-middle text-center grid place-items-center">
                  {photoData.error}
                </p>
              ) : (
                <Image
                  width={photoData.width ?? 960}
                  height={photoData.height ?? 640}
                  src={photoData.src}
                  alt={`${photoData.caption} ${photoData.date}`}
                  className="w-full block object-cover h-full"
                  aria-labelledby={captionId}
                />
              ))}
          </div>

          <figcaption className="text-white text-2xs sm:text-sm">
            <span className="absolute left-0 top-0 py-2 pl-4 pr-2 text-white bg-[#00000080] w-full flex items-center transition-transform -translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0 flex-row-reverse flex-wrap z-10">
              <span className="w-40 text-right sm:w-56">
                <a
                  href={photoData?.href || 'https://www.instagram.com/hiroya.uga/'}
                  className="bg-white px-2 py-1 z-10 cursor-pointer leading-tight inline-block no-underline text-black"
                >
                  See this photo on Instagram!
                </a>
              </span>
              <span className={clsx(['grow leading-tight', ...transitionClassName])}>
                {photoData?.caption && `${photoData?.caption}, `}
                <span className="block sm:inline">{photoData?.date}</span>
              </span>
            </span>
            <span className="absolute right-0 bottom-0 pl-4 pr-[60px] min-h-[50px] flex items-center text-white bg-[#00000080] w-full transition-transform translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0 leading-tight">
              <span className={clsx(...transitionClassName)}>
                <Spec spec={photoData?.spec ?? 'loading...'} />
              </span>
            </span>
          </figcaption>
        </figure>

        <p
          className={clsx([
            'absolute right-0 bottom-0 z-10 min-w-[50px] min-h-[50px] text-white translate-y-full group-focus-within:translate-y-0 focus-within:translate-y-0  group-hover:translate-y-0',
            'transition-[opacity_visibility_transform]',
            isFirstRender && isLoading ? 'opacity-0' : 'opacity-100',
            isFirstRender && isLoading ? 'invisible' : 'visible',
          ])}
        >
          <button
            type="button"
            className="absolute right-[8px] top-[8px] bg-white rounded-[50%] h-[calc(100%_-_16px)] w-[calc(100%_-_16px)]"
            onClick={() => updateImage()}
          >
            <Image
              src="/icon-reload.svg"
              width={48}
              height={48}
              alt="ランダムに切り替える"
              className="opacity-80 block full h-full w-full"
            />
          </button>
        </p>
      </div>
    </>
  );
};
