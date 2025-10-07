'use client';

import { useEffect, useRef } from 'react';

import styles from '@/components/Media/TwitterEmbed/TwitterEmbed.module.css';

type Props = {
  href: string;
  nocards?: boolean;
  noconversation?: boolean;
  theme?: 'light' | 'dark';
};

export const TwitterEmbed = ({ href, nocards = false, noconversation = false, theme }: Props) => {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.dataset.theme = theme ?? document.documentElement.dataset.theme ?? 'light';
    }
    if ('twttr' in window === false) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => {
        if (ref.current) {
          window.twttr?.widgets.load(ref.current);
        }
      };
      document.body.appendChild(script);
    } else if (ref.current && window.twttr) {
      window.twttr.widgets.load(ref.current);
    }
  }, [href, theme]);

  return (
    <div className={styles.root}>
      <blockquote
        ref={ref}
        className="twitter-tweet"
        data-cards={nocards ? 'hidden' : undefined}
        data-conversation={noconversation ? 'none' : undefined}
        data-theme={theme}
      >
        <a href={href.replace('x.com', 'twitter.com')}>Loading tweet...</a>
      </blockquote>
    </div>
  );
};
