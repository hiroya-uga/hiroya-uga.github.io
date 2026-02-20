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
    <ul className="@w500:grid-cols-2 @w640:gap-20px @w768:grid-cols-3 @w640:text-sm @w640:leading-21px leading-18px mb-2 grid gap-4 text-xs">
      {list.map(({ title, href, japanese, ...prop }) => {
        return (
          <li key={href} className="grid min-h-[calc(1em+1em*2*1.5)] break-all">
            <div className="min-h-60px flex">
              <a
                href={href}
                {...prop}
                className="bg-panel-primary hover:bg-panel-primary-hover border-primary transition-bg grid grow content-center rounded-l border px-3 pb-1.5 pt-2 no-underline last:rounded-r focus:relative focus:z-10"
              >
                {title}
                <span className="text-secondary text-2xs inline-block no-underline">{new URL(href).hostname}</span>
              </a>{' '}
              {japanese && (
                <span className="-left-1PX group relative flex shrink-0">
                  <a
                    href={japanese}
                    className="border-primary bg-(--v-color-background-tertiary) hover:bg-(--v-color-background-tertiary-hover) transition-bg flex grow items-center rounded-r border px-2"
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
