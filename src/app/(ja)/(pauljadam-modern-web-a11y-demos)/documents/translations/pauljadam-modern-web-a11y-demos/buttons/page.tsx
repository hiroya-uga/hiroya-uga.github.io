import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/buttons/buttons.css';
import '@/app/(ja)/(pauljadam-modern-web-a11y-demos)/documents/translations/pauljadam-modern-web-a11y-demos/buttons/page.css';

import type { Metadata } from 'next';

export const metadata: Metadata & { title: string } = {
  title: 'スタイリングされたボタンの例',
  description: 'Web開発者の物置。',
};

export default function Page() {
  return (
    <>
      <h1>{metadata.title}</h1>

      <ul>
        <li>
          <input type="button" className="primary" value="優先度高" />
        </li>
        <li>
          <input type="button" className="secondary" value="通常ボタン" />
        </li>
        <li>
          <input type="button" className="info" value="お知らせボタン" />
        </li>
        <li>
          <input type="button" className="help" value="ヘルプボタン" />
        </li>
        <li>
          <input type="button" className="danger" value="重要なボタン" />
        </li>
      </ul>
    </>
  );
}
