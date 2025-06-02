import Image from 'next/image';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';

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
        <Image
          src="/common/images/icons/new-window.svg"
          alt="新しいタブで開く"
          className="mb-[0.2em] ml-[0.2em] inline-block size-[1em]"
          width={16}
          height={16}
        />
      )}
    </Link>
  );
};
