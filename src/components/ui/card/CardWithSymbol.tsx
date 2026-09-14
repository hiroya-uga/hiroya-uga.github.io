import clsx from 'clsx';
import Link from 'next/link';

type Props = {
  href: string;
  title: string;
  symbol: string;
  description?: string;
};

export const CardWithSymbol = ({ href, title, symbol, description }: Readonly<Props>) => {
  const descriptionId = description ? href : undefined;

  return (
    <div className="flow-root gap-x-3 gap-y-1 leading-[1.640625rem]">
      <p className={clsx(['mb-1 block', '@w280:contents'])}>
        <Link
          href={href}
          className={clsx(['group flex flex-col-reverse rounded-md no-underline', '@w280:contents'])}
          aria-describedby={descriptionId}
        >
          <span
            className={clsx([
              'inline-block underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current',
              '@w280:w-[calc(70%-14px)]',
            ])}
          >
            {title}
          </span>
          <span
            className={clsx([
              'bg-card font-emoji mb-2 grid aspect-[1.618/1] place-content-center overflow-hidden rounded-md text-[3.5rem] leading-none',
              '@w280:aspect-square @w280:text-[min(14.93vw,56px)] @w280:w-[30%]',
              '@w280:float-left @w280:mr-14PX @w280:mt-5px',
            ])}
            aria-hidden="true"
          >
            <span className="backface-hidden rotate-[0.1deg] scale-[0.85] drop-shadow-[1px_1px_0px_rgb(0_0_0/0.5)] transition-transform duration-300 group-hover:scale-100 dark:drop-shadow-[1px_2px_0px_rgb(255_255_255/0.5)]">
              {symbol}
            </span>
          </span>
        </Link>
      </p>
      {description && (
        <p className={clsx(['@w280:text-justify', 'text-sm'])} id={descriptionId}>
          {description}
        </p>
      )}
    </div>
  );
};
