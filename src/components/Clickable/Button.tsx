import { AnchorHTMLAttributes } from 'react';

import Image from 'next/image';
import Link, { LinkProps } from 'next/link';

export const Button = ({
  children,
  ...props
}: Omit<LinkProps, 'className'> & {
  children: React.ReactNode;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
}) => {
  return (
    <Link
      {...props}
      className="inline-block rounded-lg bg-slate-200 px-4 py-3 text-sm text-black no-underline transition-colors hover:bg-slate-300"
    >
      {children}
      {props.target === '_blank' && (
        <Image
          src="/common/images/icons/new-window-black.svg"
          alt="新しいタブで開く"
          className="mb-[0.2em] ml-[0.2em] inline-block size-[1em]"
          width={16}
          height={16}
        />
      )}
    </Link>
  );
};
