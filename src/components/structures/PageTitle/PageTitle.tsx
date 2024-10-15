import clsx from 'clsx';

export const PageTitle = ({
  title,
  previous,
  children,
}: {
  title: string;
  previous?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-14 sm:mb-20">
      <h1
        className={clsx([
          previous ? 'leading-none' : 'text-3xl font-bold leading-relaxed sm:text-[2.625rem]',
          '[&:not(:last-child)]:mb-4',
        ])}
      >
        {previous ? (
          <>
            <span className="text-sm">{previous}</span>
            <strong className="block text-3xl font-bold leading-relaxed sm:text-[2.625rem]">{title}</strong>
          </>
        ) : (
          title
        )}
      </h1>
      {children}
    </div>
  );
};
