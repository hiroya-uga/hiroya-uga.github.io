import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/alerttimer/DocumentScript';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'WAI-ARIAのrole="alert"とsetTimeout - PaulJAdam\'s Modern Web Accessibility Demos',
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  twitter: {
    card: 'summary_large_image',
    title: 'WAI-ARIAのrole="alert"とsetTimeout - PaulJAdam\'s Modern Web Accessibility Demos',
    description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
  },
});

export default function Page() {
  return (
    <>
      <h1>
        WAI-ARIAの<code>role="alert"</code>と<code>setTimeout</code>
      </h1>

      <DocumentScript />

      <span tabIndex={0}>ここにはタブフォーカスが当たります。６秒後にアラート文が自動的に読み上げられます。</span>
      <div id="alert-div" role="alert"></div>
    </>
  );
}
