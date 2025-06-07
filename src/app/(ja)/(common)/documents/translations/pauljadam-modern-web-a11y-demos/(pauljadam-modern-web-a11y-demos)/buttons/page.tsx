import buttonsStyles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/buttons/buttons.module.css';
import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/buttons/page.module.css';

import { getMetadata } from '@/utils/seo';
import clsx from 'clsx';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/buttons');

export default function Page() {
  return (
    <div className={clsx([buttonsStyles.page, styles.page])}>
      <h1>{metadata.pageTitle}</h1>

      <ul>
        <li>
          <input type="button" className={buttonsStyles.primary} value="優先度高" />
        </li>
        <li>
          <input type="button" className={buttonsStyles.secondary} value="通常ボタン" />
        </li>
        <li>
          <input type="button" className={buttonsStyles.info} value="お知らせボタン" />
        </li>
        <li>
          <input type="button" className={buttonsStyles.help} value="ヘルプボタン" />
        </li>
        <li>
          <input type="button" className={buttonsStyles.danger} value="重要なボタン" />
        </li>
      </ul>
    </div>
  );
}
