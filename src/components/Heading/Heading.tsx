import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  keepUseMarginTop?: boolean;
  id?: string;
};

export const Heading = ({ level = 2, keepUseMarginTop = false, ...props }: Props) => {
  const TagName = `h${level}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <TagName
      className={clsx([
        'mb-paragraph font-bold leading-snug',
        keepUseMarginTop === true ? 'sm:mt-[2.5lh]' : 'not-first:mt-[2.5lh]',
        level === 2 && 'text-xl sm:text-2xl',
        level === 3 && 'text-lg sm:text-xl',
        level === 4 && 'text-base sm:text-lg',
      ])}
      {...props}
    />
  );
};
