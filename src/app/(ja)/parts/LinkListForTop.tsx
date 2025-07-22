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
    <ul className="@w640:grid @w640:grid-cols-2 @w640:gap-x-[30px] @w640:gap-y-[24px] @w640:pl-0 @w640:text-sm @w768:grid-cols-3 mb-2 pl-4 leading-normal">
      {list.map(({ title, href, japanese, ...prop }, index, { length }) => {
        return (
          <li
            key={href}
            className={clsx([
              index !== length - 1 && '@w640:pb-0 pb-3',
              '@w640:grid @w640:min-h-[calc(1em+1em*2*1.5)] list-disc',
              'break-all',
            ])}
          >
            <div className="@w640:flex @w640:min-h-[60px]">
              <a
                href={href}
                {...prop}
                className="@w640:bg-secondary @w640:grid @w640:grow @w640:content-center @w640:rounded-l @w640:p-2 @w640:pl-3 last:rounded-r focus:relative focus:z-10"
              >
                {title}
              </a>{' '}
              {japanese && (
                <span className="@w640:flex @w640:shrink-0 @w640:before:hidden @w640:after:hidden transition-colors before:content-['['] after:content-[']']">
                  <a
                    href={japanese}
                    className="@w640:flex @w640:grow @w640:items-center @w640:rounded-r @w640:border-l @w640:border-dotted @w640:border-l-secondary @w640:bg-(--v-color-background-tertiary) @w640:hover:bg-(--v-color-background-tertiary-hover) @w640:px-2 @w640:hover:translate-x-2 @w640:hover:translate-y-1 @w640:hover:rotate-6 transition-transform"
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
