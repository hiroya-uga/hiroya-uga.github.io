import styles from '@/app/(ja)/(common)/documents/translations/pauljadam-modern-web-a11y-demos/(pauljadam-modern-web-a11y-demos)/apple-system-css-font/page.module.css';

import { SampleImage } from '@/components/specific/documents/pauljadam-modern-web-a11y-demos';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata('/documents/translations/pauljadam-modern-web-a11y-demos/apple-system-css-font');

export default function Page() {
  return (
    <div className={styles.page}>
      <h1>{metadata.pageTitle}</h1>

      <SampleImage
        filename="/apple-system-css-font-IMG_0371.png"
        alt="iOSのアクセシビリティ項目「さらに大きな文字」の設定画面のスクリーンショット"
        width={300}
        height={534}
      />
      <div className={styles.body}>
        <h2>Body</h2>
        <p>-apple-system-body</p>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
      </div>
      <h2 className={styles.caption1}>Caption 1</h2>

      <div className={styles.caption1}>-apple-system-caption 1</div>

      <h2 className={styles.caption2}>Caption 2</h2>

      <div className={styles.caption2}>-apple-system-caption 2</div>

      <h2 className={styles.footnote}>Footnote</h2>

      <div className={styles.footnote}>-apple-system-footnote</div>

      <h2 className={styles.headline}>Headline</h2>

      <div className={styles.headline}>-apple-system-headline</div>

      <div className={styles['short-body']}>
        <h2>Short Body</h2>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non consequatur, porro facilis voluptatem, provident
          quae, est aperiam laborum quibusdam consectetur quidem excepturi nobis sed perspiciatis ex! Doloremque
          reprehenderit odit nihil!
        </p>
      </div>
      <h2 className={styles['short-caption1']}>Short Caption 1</h2>

      <div className={styles['short-caption1']}>-apple-system-short-caption 1</div>

      <h2 className={styles['short-footnote']}>Short Footnote</h2>

      <div className={styles['short-footnote']}>-apple-system-short-footnote</div>

      <h2 className={styles['short-headline']}>Short Headline</h2>

      <div className={styles['short-headline']}>-apple-system-short-headline</div>

      <h2 className={styles['short-subheadline']}>Short Subheadline</h2>

      <div className={styles['short-subheadline']}>-apple-system-short-subheadline</div>

      <h2 className={styles.subheadline}>Subheadline</h2>

      <div className={styles.subheadline}>-apple-system-subheadline</div>

      <div className={styles['tall-body']}>
        <h2>Tall Body</h2>
        <p>-apple-system-tall-body</p>
        <p>
          素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。素早い茶色の狐はのろまな犬を飛び越える。孤独なFOXは片目のハウンドを追いかける。スペインで雨降る平地を歩行する？素早い茶色の狐はのろまな犬を飛び越える。
        </p>
      </div>
    </div>
  );
}
