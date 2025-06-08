import { HTMLAttributes, useEffect, useRef } from 'react';

export const AnAltDecisionTreeHeading = ({
  children,
  index,
}: Pick<HTMLAttributes<HTMLHeadingElement>, 'children'> & { index?: number }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (index !== 0) {
      ref.current?.focus();
    }
  }, [index]);

  const HeadingInner = () => {
    if (typeof index === 'number') {
      return (
        <h2
          className="mx-auto mb-5 mt-0 flex w-fit items-center justify-center bg-[url(/tools/an-alt-decision-tree/e0880_1.svg)] bg-cover bg-no-repeat pb-16 pl-8 pr-6 pt-9 text-lg sm:w-full sm:max-w-[80%] sm:text-center sm:text-2xl"
          ref={ref}
          tabIndex={-1}
        >
          <span className="mr-3 grid aspect-square h-10 place-items-center rounded-md bg-gray-200 p-1 leading-none sm:mr-4 sm:h-12">
            Q{index + 1}
          </span>
          <strong className="font-normal">{children}</strong>
        </h2>
      );
    }

    return (
      <h2 className="mb-9 mt-0 text-center text-xl sm:text-2xl" ref={ref} tabIndex={-1}>
        {children}
      </h2>
    );
  };

  return (
    <div aria-live="assertive">
      <HeadingInner />
    </div>
  );
};
