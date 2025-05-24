type Props = {
  href: string;
  children: React.ReactNode;
};

export const HelpLink = ({ href, children }: Props) => {
  return (
    <a href={href} className="grid grid-cols-[1rem_auto] gap-1 text-base leading-[1.875]">
      <img src="/common/images/icons/question.svg" alt="" className="mt-[0.4375rem] size-4" />
      <span>{children}</span>
    </a>
  );
};
