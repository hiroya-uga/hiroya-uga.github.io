import { SvgIcon } from '@/components/Icons';
import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>;

export const HelpLink = ({ href, children, ...props }: Props) => {
  return (
    <Link {...props} href={href} className="leading-base grid w-fit grid-cols-[1rem_auto] gap-1 text-base">
      <span className="mt-7px relative block size-4">
        <SvgIcon name="question" alt="" />
      </span>
      <span>{children}</span>
    </Link>
  );
};
