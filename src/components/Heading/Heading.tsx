import clsx from 'clsx';

type Props = {
  children: string;
  level?: 2 | 3 | 4 | 5 | 6;
  keepUseMarginTop?: boolean;
};

export const Heading = ({ level = 2, children, keepUseMarginTop = false }: Props) => {
  switch (level) {
    case 2:
      return (
        <h2
          className={clsx([
            'mb-paragraph text-xl font-bold leading-snug sm:text-2xl',
            keepUseMarginTop === true ? 'sm:mt-[2.5lh]' : '[&:not(:first-child)]:mt-[2.5lh]',
          ])}
        >
          {children}
        </h2>
      );

    default:
      return <></>;
  }
};
