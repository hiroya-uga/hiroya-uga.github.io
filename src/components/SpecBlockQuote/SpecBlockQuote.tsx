import { BlockquoteHTMLAttributes } from 'react';

type Props = BlockquoteHTMLAttributes<HTMLQuoteElement> & {
  title: string;
  ja?: string;
};

export const SpecBlockQuote = ({ cite, title, ja, children }: Props) => {
  return (
    <div className="relative rounded-md bg-white pl-2 pt-3" data-id="blockquote">
      <div aria-hidden="true" className="-mb-8 select-none font-mono text-8xl leading-none opacity-10">
        “
      </div>

      <figure className="px-6 pb-4">
        <blockquote cite={cite} className="mb-8">
          {children}
        </blockquote>
        <figcaption className="text-right text-sm">
          <p>
            引用：
            {ja ? (
              <>
                <a href={cite}>{title}</a>（<a href={ja}>日本語訳</a>）
              </>
            ) : (
              <a href={cite}>{title}</a>
            )}
          </p>
        </figcaption>
      </figure>
    </div>
  );
};
