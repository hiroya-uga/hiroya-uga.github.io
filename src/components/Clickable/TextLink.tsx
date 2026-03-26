import React from 'react';

import { SvgIcon } from '@/components/Icons';
import { OPEN_NEW_TAB } from '@/constants/messages';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  lang?: 'ja' | 'en';
} & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'hrefLang' | 'target'>;

export const TextLink = ({ href, children, target, lang = 'ja', ...props }: Props) => {
  return (
    <Link
      {...props}
      href={href}
      className="leading-inherit mx-[0.2em]"
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
    >
      {children}
      {target === '_blank' && (
        <span className="mb-4px relative ml-[0.2em] inline-block size-[1em] align-middle">
          <SvgIcon name="new-tab" alt={OPEN_NEW_TAB[lang]} />
        </span>
      )}
    </Link>
  );
};
