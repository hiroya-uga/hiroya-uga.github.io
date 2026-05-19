export const LinkToOriginal = ({
  origins,
}: {
  origins: { title: string; href: string; lang: string; hrefLang?: string }[];
}) => {
  return (
    <>
      <p>
        この文書は
        {origins.map(({ title, href, lang, ...item }) => {
          return (
            <span className="w640:[&:not(:first-child:last-child)]:block w640:inline-block" key={title}>
              「
              <a href={href} hrefLang={item.hrefLang ?? lang} lang={lang}>
                {title}
              </a>
              」
            </span>
          );
        })}
        の日本語訳です。
      </p>
      <p>正確な内容については、原文の最新版をご確認ください。</p>
    </>
  );
};
