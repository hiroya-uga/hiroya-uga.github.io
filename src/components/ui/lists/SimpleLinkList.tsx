import { AnchorHTMLAttributes } from 'react';

import { Picture } from '@/components/ui/features/Picture';
import Link from 'next/link';

export type SimpleLnkListProps = {
  list: {
    title: React.ReactNode;
    description?: React.ReactNode;
    href: string | undefined;
    lang?: string;
    hrefLang?: string;
    target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  }[];
};
export const SimpleLinkList = ({ list }: Readonly<SimpleLnkListProps>) => {
  return (
    <ul>
      {list.map(({ title, href, description, lang, hrefLang, target }, index) => {
        return (
          <li
            key={`${href}${index}`}
            className="not-last:mb-6 w640:not-last:mb-6 w640:pl-2 w640:text-base flex pl-1 text-sm"
          >
            <span className="w640:min-w-2 w640:max-w-2 min-w-1.5 max-w-1.5 px-px pt-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                <circle cx="50" cy="50" r="50" fill="var(--x-fill, var(--color-primary))" />
              </svg>
            </span>
            <span className="w640:pl-2.5 pl-1.5">
              {typeof href === 'undefined' ? (
                <span className="palt">{title}</span>
              ) : (
                <Link href={href} lang={lang} hrefLang={hrefLang} className="palt" target={target}>
                  {title}
                  {target === '_blank' && (
                    <Picture
                      src="/common/images/icons/new-window.svg"
                      alt="新しいタブで開く"
                      className="mb-[0.2em] ml-[0.2em] inline-block size-[1em]"
                      width={16}
                      height={16}
                    />
                  )}
                </Link>
              )}

              {description && (
                <span className="text-secondary w640:mt-1 w640:text-base w640:leading-relaxed mt-2 block text-sm">
                  {description}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
