import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-pressed/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/aria-pressed/page.module.css';

import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/aria-pressed');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>
      <DocumentScript />
      <p>
        <a href="#" aria-pressed="true" role="button">
          表示する
        </a>{' '}
        (a[role=button])
      </p>
      <p>
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <a href="#" aria-pressed="true">
          表示
        </a>
      </p>
      <p>
        <button aria-pressed="true">展開する</button>
      </p>

      <button role="button" aria-pressed="false" id="toggleBtn">
        編集モード
      </button>
    </div>
  );
}
