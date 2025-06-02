import Image from 'next/image';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';

export type SimpleLnkListProps = {
  list: {
    title: React.ReactNode;
    description?: React.ReactNode;
    href: string;
    lang?: string;
    hrefLang?: string;
    target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  }[];
};
export const SimpleLinkList = ({ list }: SimpleLnkListProps) => {
  return (
    <ul>
      {list.map(({ title, href, description, lang, hrefLang, target }) => {
        return (
          <li key={href} className="flex pl-2 [&:not(:last-child)]:mb-2 sm:[&:not(:last-child)]:mb-1">
            <span className="min-w-2 max-w-2 px-px pt-[0.8rem]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                <circle cx="50" cy="50" r="50" fill="#333" />
              </svg>
            </span>
            <span className="pl-3">
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
              {description && <span className="block text-sm sm:text-base sm:leading-relaxed">{description}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
