import type { Metadata } from 'next';

export default function Page() {
  return (
    <>
      <h1>アクセシブル施策の失敗例</h1>

      <h2>
        別タブで開くことを<code>aria-label</code>属性で伝えようとして失敗している
      </h2>

      <a href="http://pauljadam.com" target="_blank" aria-label="新しいタブで開きます">
        PaulJAdam.com
      </a>
    </>
  );
}

export const metadata: Metadata = {
  title: "アクセシブル施策の失敗例 - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: "アクセシブル施策の失敗例 - PaulJAdam's Modern Web Accessibility Demos",
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
};
