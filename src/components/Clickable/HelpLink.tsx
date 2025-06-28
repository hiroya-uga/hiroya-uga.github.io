import { SvgIcon } from '@/components/Icons';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
};

export const HelpLink = ({ href, children }: Props) => {
  return (
    <Link href={href} className="grid w-fit grid-cols-[1rem_auto] gap-1 text-base leading-[1.875]">
      <span className="mt-7px relative block size-4">
        <SvgIcon name="question" alt="" />
      </span>
      <span>{children}</span>
    </Link>
  );
};
