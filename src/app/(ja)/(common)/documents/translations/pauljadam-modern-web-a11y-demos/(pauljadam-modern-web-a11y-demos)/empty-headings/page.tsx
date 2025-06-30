import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/empty-headings/page.module.css';

import { getMetadata } from '@/utils/get-metadata';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/empty-headings');

export default function Page() {
  return (
    <>
      <h1>{metadata.pageTitle}</h1>
      <h1>からっぽの見出しレベル1から6の見出し要素</h1>
      <h1></h1>
      <h2></h2>
      <h3></h3>
      <h4></h4>
      <h5></h5>
      <h6></h6>
      <h1>からっぽの見出しレベル1から6の見出し要素（CSSあり）</h1>
      <h1 className={styles.styled}></h1>
      <h2 className={styles.styled}></h2>
      <h3 className={styles.styled}></h3>
      <h4 className={styles.styled}></h4>
      <h5 className={styles.styled}></h5>
      <h6 className={styles.styled}></h6>
    </>
  );
}
