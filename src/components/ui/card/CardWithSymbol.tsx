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
    <div className={clsx(['@w360:grid @w360:grid-cols-[8.5rem_1fr] @w360:grid-rows-[auto_1fr] gap-x-3 gap-y-1'])}>
      <p
        className={clsx([
          'mb-1 block',
          '@w360:grid @w360:grid-cols-subgrid @w360:grid-rows-subgrid @w360:col-start-1 @w360:-col-end-1 @w360:row-start-1 @w360:-row-end-1 @w360:mb-0',
        ])}
      >
        <Link
          href={href}
          className={clsx([
            'group flex flex-col-reverse rounded-md no-underline',
            '@w360:grid @w360:grid-cols-subgrid @w360:grid-rows-subgrid @w360:col-start-1 @w360:-col-end-1 @w360:row-start-1 @w360:-row-end-1',
          ])}
          aria-describedby={descriptionId}
        >
          <span
            className={clsx([
              'inline-block leading-normal underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current',
              '@w360:col-start-2 @w360:pt-0.5 @w360:col-end-3 @w360:row-start-1 @w360:row-end-2',
            ])}
          >
            {title}
          </span>
          <span
            className={clsx([
              'bg-card font-emoji mb-2 grid aspect-[1.618/1] place-content-center overflow-hidden rounded-md text-[3.5rem] leading-none',
              '@w360:col-start-1 @w360:col-end-2 @w360:row-start-1 @w360:row-end-3 @w360:mb-0 @w360:aspect-square',
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
        <p
          className={clsx(['@w360:col-start-2 @w360:col-end-3 @w360:row-start-2 @w360:row-end-3', 'text-sm'])}
          id={descriptionId}
        >
          {description}
        </p>
      )}
    </div>
  );
};
