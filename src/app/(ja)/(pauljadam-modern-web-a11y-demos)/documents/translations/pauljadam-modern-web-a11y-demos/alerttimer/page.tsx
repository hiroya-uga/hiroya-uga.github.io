import { DocumentScript } from '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/alerttimer/DocumentScript';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'WAI-ARIAのrole="alert"とsetTimeout',
  description: 'Web開発者の物置。',
};

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
