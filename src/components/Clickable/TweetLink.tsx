'use client';

import { useEffect, useState } from 'react';

type Props = {
  className?: string;
  message?: string;
  hashtags?: string[];
};

export const TweetLink = (props: Props) => {
  const [twitterShareUrl, setTwitterShareUrl] = useState('');

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set('utm_source', 'twitter');
    url.searchParams.set('utm_medium', 'social');
    url.searchParams.set('utm_campaign', 'share');

    const message = encodeURIComponent(
      `👏${(props.message || document.title.split('|')[0].trim()) + '\n'}${url.toString()}`,
    );
    const hashtags = encodeURIComponent(['ugadev', ...(props.hashtags ?? [])].join(','));

    setTwitterShareUrl(`https://twitter.com/intent/tweet?text=${message}&hashtags=${hashtags}`);
  }, [props.hashtags, props.message]);

  return (
    <a
      href={twitterShareUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={
        props.className ??
        'not-[[href]]:opacity-0 not-[[href]]:invisible mx-auto flex w-fit place-items-center gap-1 rounded-lg border border-solid bg-black py-0.5 pl-4 pr-3 text-sm text-white no-underline transition-[opacity,visibility,box-shadow] hover:underline hover:shadow-lg sm:py-0 sm:text-base'
      }
    >
      <span className="text-[1.2em]">𝕏</span>拍手する
    </a>
  );
};
