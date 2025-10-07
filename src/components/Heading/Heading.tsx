import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  keepUseMarginTop?: boolean;
  id?: string;
};

export const Heading = ({ level = 2, keepUseMarginTop = false, ...props }: Props) => {
  const TagName = `h${level}` as const;

  return (
    <TagName
      className={clsx([
        'mb-paragraph font-bold leading-snug',
        keepUseMarginTop === true ? 'mt-(--margin-heading-top)' : 'not-first:mt-(--margin-heading-top)',
        level === 2 && '@w640:text-2xl text-xl',
        level === 3 && '@w640:text-xl text-lg',
        level === 4 && '@w640:text-lg text-base',
      ])}
      {...props}
    />
  );
};
