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
  const isNewTab = props.target === '_blank';

  return (
    <Link
      {...props}
      className="group/button block w-full max-w-80 rounded-full bg-slate-200 py-3 pl-7 pr-5 align-middle text-sm text-black no-underline transition-colors hover:bg-slate-300"
      rel={isNewTab ? 'noopener noreferrer' : undefined}
    >
      <span className="mx-auto grid w-fit grid-cols-[auto_0.875rem] place-items-center gap-1.5">
        <span>{children}</span>
        {isNewTab ? (
          <Image
            src="/common/images/icons/new-window-black.svg"
            alt="新しいタブで開く"
            className="inline-block size-[1em]"
            width={16}
            height={16}
          />
        ) : (
          <Image
            src="/common/images/icons/arrow2-right-black.svg"
            alt=""
            className="inline-block size-[1em] transition-transform group-hover/button:translate-x-1"
            width={16}
            height={16}
          />
        )}
      </span>
    </Link>
  );
};
