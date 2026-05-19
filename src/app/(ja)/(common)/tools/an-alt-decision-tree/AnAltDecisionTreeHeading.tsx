import { forwardRef, HTMLAttributes, useEffect, useRef } from 'react';

const HeadingInnerComponent = (
  { children, index }: { children: React.ReactNode; index?: number },
  ref: React.Ref<HTMLHeadingElement>,
) => {
  if (typeof index === 'number') {
    return (
      <h2
        className="w640:w-full w640:max-w-[80%] w640:text-center w640:text-2xl relative mx-auto mb-5 mt-0 flex w-fit items-center justify-center pb-16 pl-8 pr-6 pt-9 text-lg before:pointer-events-none before:absolute before:inset-0 before:bg-[url(/tools/an-alt-decision-tree/e0880_1.svg)] before:bg-cover before:bg-no-repeat dark:before:invert"
        ref={ref}
        tabIndex={-1}
      >
        <span className="bg-tertiary w640:mr-4 w640:h-12 mr-3 grid aspect-square h-10 place-items-center rounded-md p-1 leading-none">
          Q{index + 1}
        </span>
        <strong className="font-normal">{children}</strong>
      </h2>
    );
  }

  return (
    <h2 className="w640:text-2xl mb-9 mt-0 text-center text-xl" ref={ref} tabIndex={-1}>
      {children}
    </h2>
  );
};

const HeadingInner = forwardRef(HeadingInnerComponent);

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

  return (
    <div aria-live="assertive">
      <HeadingInner index={index} ref={ref}>
        {children}
      </HeadingInner>
    </div>
  );
};
