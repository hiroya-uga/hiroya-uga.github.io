import { getMetadata } from '@/utils/seo';

export default function Page() {
  return (
    <>
      <h1>
        略語の展開を表すための<code>title</code>属性を持つ<code>abbr</code>要素
      </h1>

      <p>
        <abbr title="HyperText Markup Language">HTML</abbr>
      </p>
      <p>
        <a href="http://www.w3.org/TR/WCAG20/">
          <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>
        </a>
      </p>
      <p>
        <abbr title="Web Accessibility Initiative - Accessible Rich Internet Applications">WAI-ARIA</abbr>
      </p>
      <p>
        <abbr title="超ベリーグッド">
          <a href="https://ja.wikipedia.org/wiki/%E3%83%81%E3%83%A7%E3%83%99%E3%83%AA%E3%82%B0">チョベリグ</a>
        </abbr>
      </p>
    </>
  );
}

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/abbr');
