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
    <div
      className={clsx([
        'gap-x-3 gap-y-1',
        '@w280:grid @w280:grid-cols-[min(8.5rem,30%)_1fr] @w280:grid-rows-[auto_1fr]',
      ])}
    >
      <p
        className={clsx([
          'mb-1 block',
          '@w280:grid @w280:grid-cols-subgrid @w280:grid-rows-subgrid @w280:col-start-1 @w280:-col-end-1 @w280:row-start-1 @w280:-row-end-1 @w280:mb-0',
        ])}
      >
        <Link
          href={href}
          className={clsx([
            'group flex flex-col-reverse rounded-md no-underline',
            '@w280:grid @w280:grid-cols-subgrid @w280:grid-rows-subgrid @w280:col-start-1 @w280:-col-end-1 @w280:row-start-1 @w280:-row-end-1',
          ])}
          aria-describedby={descriptionId}
        >
          <span
            className={clsx([
              'inline-block leading-normal underline decoration-transparent transition-[text-decoration-color] duration-200 group-hover:decoration-current',
              '@w280:col-start-2 @w280:pt-0.5 @w280:col-end-3 @w280:row-start-1 @w280:row-end-2',
            ])}
          >
            {title}
          </span>
          <span
            className={clsx([
              'bg-card font-emoji text-56px mb-2 grid aspect-[1.618/1] place-content-center overflow-hidden rounded-md leading-none',
              '@w280:col-start-1 @w280:col-end-2 @w280:row-start-1 @w280:row-end-3 @w280:mb-0 @w280:aspect-square @w280:text-[min(14.93vw,56px)]',
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
          className={clsx(['@w280:col-start-2 @w280:col-end-3 @w280:row-start-2 @w280:row-end-3', 'text-sm'])}
          id={descriptionId}
        >
          {description}
        </p>
      )}
    </div>
  );
};
