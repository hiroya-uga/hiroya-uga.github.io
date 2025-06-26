import { AnchorHTMLAttributes } from 'react';

import { SvgIcon } from '@/components/Icons';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
};

export const TextLink = ({ href, children, target }: Props) => {
  return (
    <Link
      href={href}
      className="mx-[0.2em] leading-[inherit]"
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
    >
      {children}
      {target === '_blank' && (
        <span className="ml-[0.2em] mb-4px align-middle [--v-fill:var(--color-link)] relative inline-block size-[1em]">
          <SvgIcon name="new-tab" alt="新しいタブで開く" />
        </span>
      )}
    </Link>
  );
};
