export type SimpleLnkListProps = {
  list: { title: React.ReactNode; description?: React.ReactNode; href: string; lang?: string; hrefLang?: string }[];
};
export const SimpleLinkList = ({ list }: SimpleLnkListProps) => {
  return (
    <ul>
      {list.map(({ title, href, description, lang, hrefLang }) => {
        return (
          <li key={href} className="flex pl-2 [&:not(:last-child)]:mb-2 sm:[&:not(:last-child)]:mb-1">
            <span className="min-w-[0.5rem] max-w-[0.5rem] px-[1px] pt-[0.8rem]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" className="w-full">
                <circle cx="50" cy="50" r="50" fill="#333" />
              </svg>
            </span>
            <span className="pl-3">
              <a href={href} lang={lang} hrefLang={hrefLang} className="palt">
                {title}
              </a>
              {description && <span className="block text-sm sm:text-base sm:leading-relaxed">{description}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
