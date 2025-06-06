import clsx from 'clsx';

export const PageTitle = ({
  title,
  previous,
  following,
  description,
  children,
}: {
  title: string;
  previous?: string;
  following?: string;
  children?: React.ReactNode;
  description?: string;
}) => {
  const hasSubtitle = Boolean(previous || following);
  return (
    <div className="mb-14 sm:mb-20">
      <h1
        className={clsx([
          hasSubtitle
            ? '[&:not(:last-child)]:mb-6'
            : 'text-3xl font-bold leading-relaxed sm:text-[2.625rem] [&:not(:last-child)]:mb-4',
          'leading-relaxed',
        ])}
      >
        {hasSubtitle ? (
          <>
            {previous && (
              <span className="relative -left-3 block w-fit rounded-2xl bg-white px-3 py-1 text-sm font-bold text-[#666]">
                {previous}
              </span>
            )}
            <strong className="block min-h-[3.046875rem] pt-1 text-3xl font-bold leading-snug sm:text-[2.625rem]">
              {title}
            </strong>
            {following && (
              <span className="relative mt-3 block pl-9 font-bold leading-normal before:absolute before:left-0 before:top-[0.5lh] before:w-8 before:-translate-y-1/2 before:border before:border-t-black sm:mt-2 sm:text-lg">
                {following}
              </span>
            )}
          </>
        ) : (
          title
        )}
      </h1>
      {description?.split('\n').map((description) => {
        return <p key={description}>{description}</p>;
      })}
      {children}
    </div>
  );
};
