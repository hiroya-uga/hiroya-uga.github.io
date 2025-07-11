import { DocumentScript } from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/checkbox/DocumentScript';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/checkbox/page.module.css';

import { getMetadata } from '@/utils/get-metadata';

export default function Page() {
  return (
    <div className={styles.page}>
      <DocumentScript />

      <h1>WAI-ARIAを利用したものと純粋なチェックボックスの比較</h1>
      <p>
        <a href="http://www.w3.org/TR/wai-aria-practices-1.1/#checkbox">
          http://www.w3.org/TR/wai-aria-practices-1.1/#checkbox
        </a>
      </p>

      <h2>純粋なチェックボックス</h2>

      <label>
        <input type="checkbox" />
        <span>同意する場合はチェックを入れてください。</span>
      </label>

      <h2>非アクセシブルなマウス専用のチェックボックス</h2>

      <span id="spancheckbox" className={styles.unchecked}>
        同意する場合はチェックを入れてください。
      </span>

      <h2>ARIA Checkbox</h2>

      <span className={styles.unchecked} role="checkbox" aria-checked="false" tabIndex={0}>
        同意する場合はチェックを入れてください。
      </span>
    </div>
  );
}

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/checkbox');
