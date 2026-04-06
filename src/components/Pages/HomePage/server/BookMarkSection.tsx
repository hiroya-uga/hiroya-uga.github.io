interface Bookmark {
  href: string;
  title: string;
  hrefLang?: string;
  japanese?: string;
}

const bookmarks: Bookmark[] = [
  {
    href: 'https://wicg.github.io/aom/',
    hrefLang: 'en',
    title: 'The Accessibility Object Model (AOM)',
    japanese: 'https://masup9.github.io/aom/',
  },
  {
    href: 'https://www.w3.org/TR/accname-1.1/',
    hrefLang: 'en',
    title: 'Accessible Name and Description Computation 1.1',
    japanese: 'https://momdo.github.io/accname-1.1/',
  },
  {
    href: 'https://html.spec.whatwg.org/multipage/',
    hrefLang: 'en',
    title: 'HTML Living Standard',
    japanese: 'https://momdo.github.io/html/',
  },
  {
    href: 'https://www.w3.org/TR/wai-aria-1.2/',
    hrefLang: 'en',
    title: 'Accessible Rich Internet Applications (WAI-ARIA) 1.2',
    japanese: 'https://momdo.github.io/wai-aria-1.2/',
  },
  {
    href: 'https://www.w3.org/TR/html-aria/',
    hrefLang: 'en',
    title: 'ARIA in HTML',
    japanese: 'https://momdo.github.io/html-aria/',
  },
  {
    href: 'https://w3c.github.io/wcag/guidelines/22/',
    hrefLang: 'en',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    japanese: 'https://waic.jp/translations/WCAG22/',
  },
  {
    href: 'https://www.w3.org/TR/wcag-3.0/',
    hrefLang: 'en',
    title: 'W3C Accessibility Guidelines (WCAG) 3.0',
  },
  {
    href: 'https://www.w3.org/TR/html-aam-1.0/',
    hrefLang: 'en',
    title: 'HTML Accessibility API Mappings 1.0',
  },
  {
    href: 'https://www.w3.org/WAI/ARIA/apg/',
    hrefLang: 'en',
    title: 'ARIA Authoring Practices Guide (APG)',
  },
  {
    href: 'https://www.w3.org/WAI/tutorials/images/decision-tree/',
    hrefLang: 'en',
    title: 'An alt Decision Tree',
    japanese: 'https://www.w3.org/WAI/tutorials/images/decision-tree/ja',
  },
  {
    href: 'https://www.w3.org/Provider/Style/URI.html',
    hrefLang: 'en',
    title: "Hypertext Style: Cool URIs don't change.",
    japanese: 'https://www.kanzaki.com/docs/Style/URI.html',
  },
  {
    href: 'https://a11ysupport.io/',
    hrefLang: 'en',
    title: 'Accessibility Support',
  },
  {
    href: 'https://github.com/tc39/proposals',
    hrefLang: 'en',
    title: 'TC39/Proposals',
  },
];

const linkList = bookmarks.toSorted((a, b) => {
  const aUrl = new URL(a.href);
  const bUrl = new URL(b.href);
  if (aUrl.origin === bUrl.origin) {
    return a.title.localeCompare(b.title);
  }
  return a.href.localeCompare(b.href);
});

export const BookMarkSection = () => {
  return (
    <>
      <h2 className="@w640:text-2xl mb-2 text-xl font-bold tracking-wide">Bookmarks</h2>

      <p className="mb-4">外部サイトへのリンク集です。</p>

      <ul className="@w500:grid-cols-2 @w640:gap-20px @w768:grid-cols-3 @w640:text-sm @w640:leading-21px leading-18px mb-2 grid gap-4 text-xs">
        {linkList.map(({ title, href, japanese, ...prop }) => {
          return (
            <li key={href} className="grid min-h-[calc(1em+1em*2*1.5)] break-all">
              <div className="min-h-60px flex">
                <a
                  href={href}
                  {...prop}
                  className="bg-panel-primary hover:bg-panel-primary-hover border-primary transition-bg grid grow content-center rounded-l border px-3 py-1.5 no-underline last:rounded-r focus:relative focus:z-10"
                >
                  {title}
                  <span className="text-secondary text-2xs leading-18px inline-block no-underline">
                    {new URL(href).hostname}
                  </span>
                </a>{' '}
                {japanese && (
                  <span className="-left-1PX group relative flex shrink-0">
                    <a
                      href={japanese}
                      className="border-primary bg-(--v-color-background-tertiary) hover:bg-(--v-color-background-tertiary-hover) transition-bg flex grow items-center rounded-r border px-2"
                      aria-label={`日本語訳：${title}`}
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
    </>
  );
};
