import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/empty-headings/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title:
    "VoiceOverでは読み上げられるがJAWSおよびNVDAでは読み上げられない空のヘディングコンテンツ - PaulJAdam's Modern Web Accessibility Demos",
  description: 'PaulJAdam氏によるアクセシビリティデモの日本語訳。',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>
      <h1>からっぽの見出しレベル1から6の見出し要素</h1>
      <h1></h1>
      <h2></h2>
      <h3></h3>
      <h4></h4>
      <h5></h5>
      <h6></h6>
      <h1>からっぽの見出しレベル1から6の見出し要素（CSSあり）</h1>
      <h1 className="styled"></h1>
      <h2 className="styled"></h2>
      <h3 className="styled"></h3>
      <h4 className="styled"></h4>
      <h5 className="styled"></h5>
      <h6 className="styled"></h6>
    </>
  );
}
