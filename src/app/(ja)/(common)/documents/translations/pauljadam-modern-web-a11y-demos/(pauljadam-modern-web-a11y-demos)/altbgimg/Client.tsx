'use client';

import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/altbgimg/page.module.css';

export const DivWithOnClickEvent = () => {
  return (
    <div className={styles['bg-img']} tabIndex={0} onClick={() => alert('クリックイベントが発火しました')}>
      Webブラウジングに影響を与える障害には、320万人の視覚障害者、390万人の聴覚障害者、790万人の認知・精神障害、および980万人の歩行障害者が含まれます。
    </div>
  );
};
