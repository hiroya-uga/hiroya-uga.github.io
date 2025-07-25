import { AnchorHTMLAttributes } from 'react';

import { SvgIcon } from '@/components/Icons';
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
      className="group/button bg-(--v-color-background-tertiary) hover:bg-(--v-color-background-tertiary-hover) text-high-contrast block w-full max-w-80 rounded-full py-3 pl-7 pr-5 align-middle text-sm no-underline transition-colors"
      rel={isNewTab ? 'noopener noreferrer' : undefined}
    >
      <span className="mx-auto grid w-fit grid-cols-[auto_0.875rem] place-items-center gap-1.5 [--v-fill:var(--color-high-contrast)]">
        <span>{children}</span>
        {isNewTab ? (
          <span className="relative inline-block size-[1em]">
            <SvgIcon name="new-tab" alt="新しいタブで開く" />
          </span>
        ) : (
          <span className="relative inline-block size-[1em] transition-transform group-hover/button:translate-x-1">
            <SvgIcon name="arrow2-right" alt="新しいタブで開く" />
          </span>
        )}
      </span>
    </Link>
  );
};
