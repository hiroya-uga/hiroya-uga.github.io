import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  level?: 2 | 3 | 4 | 5 | 6;
  keepUseMarginTop?: boolean;
  id?: string;
};

export const Heading = ({ level = 2, keepUseMarginTop = false, ...props }: Props) => {
  switch (level) {
    case 2:
      return (
        <h2
          className={clsx([
            'mb-paragraph text-xl font-bold leading-snug sm:text-2xl',
            keepUseMarginTop === true ? 'sm:mt-[2.5lh]' : 'not-first:mt-[2.5lh]',
          ])}
          {...props}
        />
      );
    case 3:
      return (
        <h3
          className={clsx([
            'mb-paragraph text-lg font-bold leading-snug sm:text-xl',
            keepUseMarginTop === true ? 'sm:mt-[2.5lh]' : 'not-first:mt-[2.5lh]',
          ])}
          {...props}
        />
      );

    default:
      return <></>;
  }
};
