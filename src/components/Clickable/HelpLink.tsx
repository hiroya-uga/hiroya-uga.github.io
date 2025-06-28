import { SvgIcon } from '@/components/Icons';

type Props = {
  href: string;
  children: React.ReactNode;
};

export const HelpLink = ({ href, children }: Props) => {
  return (
    <a href={href} className="grid w-fit grid-cols-[1rem_auto] gap-1 text-base leading-[1.875]">
      <span className="block mt-7px size-4 relative [--v-fill:var(--color-link)]">
        <SvgIcon name="question" alt="" />
      </span>
      <span>{children}</span>
    </a>
  );
};
