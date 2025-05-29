import clsx from 'clsx';

export const PageTitle = ({
  title,
  previous,
  following,
  children,
}: {
  title: string;
  previous?: string;
  following?: string;
  children?: React.ReactNode;
}) => {
  const hasSubtitle = Boolean(previous || following);
  return (
    <div className="mb-14 sm:mb-20">
      <h1
        className={clsx([
          hasSubtitle ? 'leading-none' : 'text-3xl font-bold leading-relaxed sm:text-[2.625rem]',
          '[&:not(:last-child)]:mb-4',
        ])}
      >
        {hasSubtitle ? (
          <>
            {previous && (
              <span className="relative -left-3 block w-fit rounded-2xl bg-white px-3 py-1 text-sm text-[#666]">
                {previous}
              </span>
            )}
            <strong className="block text-3xl font-bold leading-relaxed sm:text-[2.625rem]">{title}</strong>
            {following && (
              <span className="text-md relative mb-6 block pl-9 font-bold before:absolute before:left-0 before:top-[0.5lh] before:w-8 before:-translate-y-1/2 before:border before:border-t-black">
                {following}
              </span>
            )}
          </>
        ) : (
          title
        )}
      </h1>
      {children}
    </div>
  );
};
