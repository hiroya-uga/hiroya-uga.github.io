'use client';

import { SvgIcon } from '@/components/ui/media/SvgIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import styles from './NotesAd.module.css';

interface Ad {
  href: string;
  alt: string;
  sources: {
    '240x60': string;
    '504x84': string;
    '1404x180': string;
  };
}

const ADS: Ad[] = [
  {
    href: '/tools/vnux',
    alt: 'vnux: Nu Html Checker for macOS',
    sources: {
      '240x60': '/notes/images/gemini-generated-vnux-240x60.webp',
      '504x84': '/notes/images/gemini-generated-vnux-504x84.webp',
      '1404x180': '/notes/images/gemini-generated-vnux-1404x180.webp',
    },
  },
];

const indexCache = new Map<string, number>();

const pickIndexFor = (pathname: string) => {
  const cache = indexCache.get(pathname);

  if (typeof cache === 'number') {
    return cache;
  }

  const index = Math.floor(Math.random() * ADS.length);
  indexCache.set(pathname, index);

  return index;
};

interface BannerProps {
  sources: Ad['sources'];
  alt: string;
  id?: string;
}

const Banner = ({ sources, alt, id }: BannerProps) => {
  return (
    <>
      <span className={styles.badge}>
        <span className={styles.label}>
          <span className={styles.icon}>
            <SvgIcon name="information" alt="" />
          </span>
          <span className={styles.text}>サイト内ツール</span>
        </span>
      </span>
      <picture>
        <source media="(width <= 21.8rem)" srcSet={sources['240x60']} width={120} height={30} />
        <source media="(21.8rem < width < 40rem)" srcSet={sources['504x84']} width={168 * 1.5} height={28 * 1.5} />
        <img src={sources['1404x180']} width={468 * 1.5} height={60 * 1.5} alt={alt} id={id} className={styles.img} />
      </picture>
    </>
  );
};

export const NotesAd = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  const isSupportedHover = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(hover: hover)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => window.matchMedia('(hover: hover)').matches,
    () => true,
  );
  const pathname = usePathname();
  const index = useSyncExternalStore(
    () => () => {},
    () => pickIndexFor(pathname),
    () => 0,
  );

  const ad = ADS[index];
  const id = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded === false || ref.current === null) {
      return;
    }

    const target = ref.current;
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Node && target.contains(e.target) === false) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [isExpanded]);

  if (isSupportedHover) {
    return (
      <p className={styles.root}>
        <Link href={ad.href} className={styles.link}>
          <Banner sources={ad.sources} alt={ad.alt} />
        </Link>
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className={styles.root}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }

        setIsExpanded(false);
      }}
    >
      <button
        type="button"
        className={styles.link}
        aria-controls={`${id}-text-link`}
        aria-expanded={isExpanded}
        onClick={(e) => {
          e.currentTarget.focus(); // for iOS
          setIsExpanded(true);
        }}
      >
        <Banner sources={ad.sources} alt={ad.alt} id={id} />
        <span className="sr-only">のリンクを表示する</span>
      </button>
      <span className={styles.textLink} id={`${id}-text-link`}>
        <Link href={ad.href} aria-describedby={id}>
          このツールを見る
        </Link>
      </span>
    </p>
  );
};
