import { AnchorHTMLAttributes } from 'react';

import Image from 'next/image';
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
export const SimpleLinkList = ({ list }: SimpleLnkListProps) => {
  return (
    <ul>
      {list.map(({ title, href, description, lang, hrefLang, target }, index) => {
        return (
          <li key={`${href}${index}`} className="not-last:mb-6 sm:not-last:mb-6 flex pl-1 text-sm sm:pl-2 sm:text-base">
            <span className="min-w-1.5 max-w-1.5 px-px pt-3 sm:min-w-2 sm:max-w-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                <circle cx="50" cy="50" r="50" fill="var(--color-text)" />
              </svg>
            </span>
            <span className="pl-1.5 sm:pl-2.5">
              {typeof href === 'undefined' ? (
                <span className="palt">{title}</span>
              ) : (
                <Link href={href} lang={lang} hrefLang={hrefLang} className="palt" target={target}>
                  {title}
                  {target === '_blank' && (
                    <Image
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
                <span className="text-secondary mt-2 block text-sm sm:mt-1 sm:text-base sm:leading-relaxed">
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
