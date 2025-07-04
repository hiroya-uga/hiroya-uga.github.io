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
    const message = encodeURIComponent(
      `👏${(props.message || document.title.split('|')[0].trim()) + '\n'}${location.href}`,
    );
    const hashtags = encodeURIComponent((props.hashtags ?? ['ugadev']).join(','));

    setTwitterShareUrl(`https://twitter.com/intent/tweet?text=${message}&hashtags=${hashtags}`);
  }, [props.hashtags, props.message]);

  return (
    <a href={twitterShareUrl || undefined} target="_blank" rel="noopener noreferrer" className={props.className}>
      𝕏 拍手する
    </a>
  );
};
