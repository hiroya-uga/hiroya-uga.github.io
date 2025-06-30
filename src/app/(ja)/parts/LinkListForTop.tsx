import clsx from 'clsx';

export const LinkListForTop = ({
  list,
}: {
  list: {
    href: string;
    title: string;
    hrefLang?: string;
    japanese?: string;
  }[];
}) => {
  return (
    <ul className="mb-2 pl-4 leading-normal sm:grid sm:grid-cols-2 sm:gap-x-[30px] sm:gap-y-[24px] sm:pl-0 sm:text-sm md:grid-cols-3">
      {list.map(({ title, href, japanese, ...prop }, index, { length }) => {
        return (
          <li
            key={href}
            className={clsx([
              index !== length - 1 && 'pb-3 sm:pb-0',
              'list-disc sm:grid sm:min-h-[calc(1em+1em*2*1.5)]',
              'break-all',
            ])}
          >
            <div className="sm:flex sm:min-h-[60px]">
              <a
                href={href}
                {...prop}
                className="sm:bg-banner last:rounded-r focus:relative focus:z-10 sm:grid sm:grow sm:content-center sm:rounded-l sm:p-2 sm:pl-3"
              >
                {title}
              </a>{' '}
              {japanese && (
                <span className="transition-colors before:content-['['] after:content-[']'] sm:flex sm:shrink-0 sm:before:hidden sm:after:hidden">
                  <a
                    href={japanese}
                    className="transition-transform sm:flex sm:grow sm:items-center sm:rounded-r sm:border-l sm:border-dotted sm:border-l-gray-400 sm:bg-slate-200 sm:px-2 sm:hover:translate-x-2 sm:hover:translate-y-1 sm:hover:rotate-6 sm:dark:bg-[#2a3544]"
                  >
                    日本語訳
                  </a>
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
